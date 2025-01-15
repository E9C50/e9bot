import RoleBaseBuilder from "role/base/RoleBaseBuilder"
import RoleBaseUpgrader from "role/base/RoleBaseUpgrader";
import { getClosestTarget, getDistance } from "utils"


function tempMoveTo(creep: Creep, target: RoomPosition) {
    let goals = [{ pos: target, range: 1 }]
    let ret = PathFinder.search(
        creep.pos, goals,
        {
            plainCost: 2,
            swampCost: 10,
            roomCallback: function (roomName) {
                let room = Game.rooms[roomName];
                let costs = new PathFinder.CostMatrix;
                if (!room) return costs

                room.find(FIND_STRUCTURES).forEach(function (struct) {
                    if (struct.structureType === STRUCTURE_ROAD) {
                        // 相对于平原，寻路时将更倾向于道路
                        costs.set(struct.pos.x, struct.pos.y, 1);
                    } else if (struct.structureType !== STRUCTURE_CONTAINER &&
                        (struct.structureType !== STRUCTURE_RAMPART ||
                            !struct.my)) {
                        // 不能穿过无法行走的建筑
                        costs.set(struct.pos.x, struct.pos.y, 0xff);
                    }
                });

                // 躲避房间中的 creep
                room.find(FIND_HOSTILE_CREEPS).forEach(function (creep) {
                    for (let x = creep.pos.x - 3; x <= creep.pos.x + 3; x++) {
                        for (let y = creep.pos.y - 3; y <= creep.pos.y + 3; y++) {
                            costs.set(x, y, 0xff);
                        }
                    }
                });

                return costs;
            },
        }
    );

    let pos = ret.path[0];
    creep.move(creep.pos.getDirectionTo(pos));
}

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return true
    },
    prepare(creep) {
        return true
    },
    source(creep) {
        // 如果没有空余容量了，就开始工作
        if (creep.store.getFreeCapacity() <= 0) {
            creep.memory.working = true
            return false
        }

        const creepData: RemoteBuilderData = data as RemoteBuilderData
        const sourceFlag = Game.flags[creepData.sourceFlag]
        const sourceStructure = Game.getObjectById(creepData.sourceFlag) as Source
        const targetPos = sourceFlag || sourceStructure

        if (targetPos == undefined) {
            creep.say('❓')
            return true
        }

        if (creep.room.name != targetPos.room?.name) {
            creep.moveTo(targetPos)
            return false
        }

        if (creep.pickupDroppedResource(false, 3)) return true

        // 如果房间有可搬运的能量，直接去搬
        var resourceTargets: AnyStoreStructure[] = [creep.room.storage, ...creep.room.containers].filter(item => item != undefined) as AnyStoreStructure[]
        if (!creep.room.my) {
            resourceTargets = [...creep.room.spawns, ...creep.room.extensions, ...creep.room.towers, ...resourceTargets]
        }
        resourceTargets = resourceTargets.filter(item => item != undefined && item.store[RESOURCE_ENERGY] > 0)

        const resourceTarget = getClosestTarget(creep.pos, resourceTargets)
        if (resourceTarget != undefined) {
            if (creep.withdraw(resourceTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(resourceTarget)
            }
            return true
        }

        const sourceList = creep.room.sources.filter(source => getDistance(source.pos, targetPos.pos) < 3)
        if (sourceList.length == 0) return false

        const sourceTarget = sourceList[0]
        if (getDistance(creep.pos, sourceTarget.pos) > 1) {
            creep.moveTo(sourceTarget)
            return true
        }

        if (sourceTarget.energy > 0) {
            creep.harvest(sourceTarget)
        }
        return true
    },
    target(creep) {
        const creepData: RemoteBuilderData = data as RemoteBuilderData
        const targetFlag = Game.flags[creepData.targetFlag]
        const targetStructure = Game.getObjectById(creepData.targetFlag) as Source
        const targetPos = targetFlag || targetStructure

        if (targetPos == undefined) {
            creep.say('❓')
            return true
        }

        if (creep.room.name != targetPos.room?.name) {
            creep.moveTo(targetPos)
            return false
        }

        if (creep.room.my && creep.room.constructionSites.length == 0) {
            return RoleBaseUpgrader(creep.memory.data).target(creep)
        }
        return RoleBaseBuilder(creep.memory.data).target(creep)
    },
})
