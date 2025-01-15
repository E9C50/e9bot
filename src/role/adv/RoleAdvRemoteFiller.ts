import { getClosestTarget, getDistance } from "utils"

function tempMoveTo(creep: Creep, target: RoomPosition) {
    let goals = [{ pos: target, range: 1 }]

    // if (creep.memory.pathCache == undefined || Game.time % 2 == 0) {
        creep.memory.pathCache = PathFinder.search(
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

                    // if (roomName == 'E36N4') {
                    //     for (let row = 0; row < 49; row++) {
                    //         for (let col = 0; col < 49; col++) {
                    //             costs.set(row, col, 0xff)
                    //         }
                    //     }
                    // }

                    // if (roomName == 'E35N4') {
                    //     for (let col = 0; col < 49; col++) {
                    //         costs.set(49, col, 0xff)
                    //     }
                    // }

                    return costs;
                },
            }
        );
    // }

    let pos = creep.memory.pathCache.path[0];
    const result = creep.moveByPath(creep.memory.pathCache.path)
    // console.log(creep.name, creep.room.name, result)
    // creep.move(creep.pos.getDirectionTo(pos))
    if (result == OK) {
        // creep.memory.pathCache.path.shift()
    }
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
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true
            return false
        }

        const creepData: RemoteFillerData = data as RemoteFillerData
        const sourceFlag: Flag = Game.flags[creepData.sourceFlag]
        const sourceTarget = Game.getObjectById(creepData.sourceFlag) as Source
        const sourcePos = sourceFlag?.pos || sourceTarget?.pos

        if (sourcePos == undefined) {
            creep.say('❓')
            return true
        }

        if (creep.room.name == 'E37N7' && sourcePos.roomName == 'E35N3' && !creep.pos.isNearTo(creep.room.spawns[0])) {
            creep.moveTo(creep.room.spawns[0])
            creepData.needRecycle = true
            return true
        }

        if (creep.pickupDroppedResource(false, 50)) return true

        // 如果不在目标房间，则去往目标房间
        if (creep.room.name != sourcePos.roomName) {
            creep.moveTo(sourcePos)
            return true
        }

        // 如果身上不止有能量，则搬运到Storage
        if (creep.room.storage != undefined && Object.keys(creep.store).filter(key => key != RESOURCE_ENERGY).length > 0) {
            if (getDistance(creep.pos, creep.room.storage.pos) > 1) {
                creep.moveTo(creep.room.storage)
                return true
            }
            creep.transfer(creep.room.storage, Object.keys(creep.store)[0] as ResourceConstant)
            return true
        }

        var withdrawTarget: Structure | undefined = undefined
        var withdrawResource: ResourceConstant | undefined = undefined

        // 如果有缓存建筑，就去拿缓存
        if (creepData.withdrawTarget != undefined) {
            withdrawTarget = Game.getObjectById(creepData.withdrawTarget) as Structure
            withdrawResource = Object.keys(withdrawTarget['store'])[0] as ResourceConstant
        }

        // 如果有PowerBank就去捡
        if ((withdrawTarget == undefined || withdrawResource == undefined)
            && creep.room.powerBanks.length > 0 && creep.room.powerBanks[0].hits == 0) {
            withdrawTarget = creep.room.powerBanks[0]
            withdrawResource = RESOURCE_POWER
        }

        // 如果有Storage并且有资源就去捡
        if ((withdrawTarget == undefined || withdrawResource == undefined)
            && creep.room.storage != undefined && creep.room.storage.store.getUsedCapacity() > 0) {
            const firstResourceType = Object.keys(creep.room.storage.store)[0] as ResourceConstant
            withdrawTarget = creep.room.storage
            withdrawResource = firstResourceType
        }

        // 如果有Spawns并且有资源就去捡
        if ((withdrawTarget == undefined || withdrawResource == undefined)) {
            const spawns = creep.room.spawns.filter(spawn => spawn.store[RESOURCE_ENERGY] > 0)
            if (spawns.length > 0) {
                withdrawTarget = getClosestTarget(creep.pos, spawns)
                withdrawResource = RESOURCE_ENERGY
            }
        }

        // 如果有Extensions并且有资源就去捡
        if ((withdrawTarget == undefined || withdrawResource == undefined)) {
            const extensions = creep.room.extensions.filter(extension => extension.store[RESOURCE_ENERGY] > 0)
            if (extensions.length > 0) {
                withdrawTarget = getClosestTarget(creep.pos, extensions)
                withdrawResource = RESOURCE_ENERGY
            }
        }

        // 如果有Containers并且有资源就去捡
        if ((withdrawTarget == undefined || withdrawResource == undefined)) {
            const containers = creep.room.containers.filter(container => container.store.getUsedCapacity() > 0)
            if (containers.length > 0) {
                const container = getClosestTarget(creep.pos, containers) as StructureContainer
                withdrawTarget = container
                withdrawResource = Object.keys(container.store)[0] as ResourceConstant
            }
        }

        if (withdrawTarget != undefined && withdrawResource != undefined) {
            if (getDistance(creep.pos, withdrawTarget.pos) > 1) {
                creep.moveTo(withdrawTarget)
                creepData.withdrawTarget = withdrawTarget.id
            } else {
                creep.withdraw(withdrawTarget, withdrawResource)
                creepData.withdrawTarget = undefined
            }
            return true
        }

        // powerbank还没好就过去等
        if (creep.room.powerBanks.length > 0 && getDistance(creep.pos, creep.room.powerBanks[0].pos) > 5) {
            creep.moveTo(creep.room.powerBanks[0])
            return true
        }

        if (creep.store.getUsedCapacity() > 0) {
            creep.memory.working = true
            return false
        }

        if (creep.room.sources.length > 0 && getDistance(creep.room.sources[0].pos, creep.pos) > 3) {
            creep.moveTo(creep.room.sources[0])
        }

        creep.say("💤")
        return true
    },
    target(creep) {
        // 如果没有资源了，就切换为采集状态
        if (creep.store.getUsedCapacity() == 0) {
            creep.memory.working = false
            return false
        }

        const creepData: RemoteFillerData = data as RemoteFillerData
        const targetFlag: Flag = Game.flags[creepData.targetFlag]
        const targetTarget = Game.getObjectById(creepData.targetFlag) as Structure
        const targetPos = targetFlag?.pos || targetTarget?.pos

        if (targetPos == undefined) {
            creep.say('❓')
            return true
        }

        if (creep.room.name != targetPos.roomName) {
            if (creep.room.name == creep.memory.spawnRoom) {
                creep.moveTo(targetPos)
                return true
            }
            tempMoveTo(creep, targetPos)
            return true
        }

        // 如果身上不止有能量，则搬运到Storage
        if (creep.room.storage != undefined && Object.keys(creep.store).filter(key => key != RESOURCE_ENERGY).length > 0) {
            if (getDistance(creep.pos, creep.room.storage.pos) > 1) {
                creep.moveTo(creep.room.storage)
                return true
            }
            creep.transfer(creep.room.storage, Object.keys(creep.store)[0] as ResourceConstant)
            return true
        }

        // 搬运到最近的storage、link、container
        var targetStructure;
        const structureList: Structure[] = [
            creep.room.storage, ...creep.room.links, ...creep.room.containers,
            ...creep.room.towers, ...creep.room.spawns, ...creep.room.extensions
        ].filter(item => item != undefined && item.store.getFreeCapacity(RESOURCE_ENERGY) > 0) as Structure[]
        if (structureList.length > 0) {
            targetStructure = getClosestTarget(creep.pos, structureList)
        } else {
            targetStructure = creep.room.spawns[0]
        }

        if (!targetStructure) {
            return true
        }

        if (getDistance(creep.pos, targetStructure.pos) > 1) {
            creep.moveTo(targetStructure)
            return true
        }

        if (targetStructure) {
            creep.transfer(targetStructure, RESOURCE_ENERGY)
        }
        return true
    },
})
