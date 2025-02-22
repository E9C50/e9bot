import RoleBaseBuilder from "role/base/RoleBaseBuilder"
import RoleBaseUpgrader from "role/base/RoleBaseUpgrader";
import { getClosestTarget, getDistance } from "utils"

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return true
    },
    prepare(creep) {
        // if (Game.shard.name == 'shard3') {
        //     const shardMemory = JSON.parse(InterShardMemory.getLocal())
        //     shardMemory[creep.name] = creep.memory
        //     InterShardMemory.setLocal(JSON.stringify(shardMemory))
        // }
        // if (Game.shard.name == 'shard2') {
        //     const shardMemory = JSON.parse(InterShardMemory.getRemote('shard3') || '{}')
        //     creep.memory = shardMemory[creep.name]
        // }
        return creep.goBoost()
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

        if (targetPos == undefined) return true

        if (creep.room.name != targetPos.room?.name) {
            creep.moveTo(targetPos, { visualizePathStyle: {} })
            return false
        }

        if (creep.room.portals.length > 0) {
            creep.moveTo(targetPos)
            return false
        }

        // if (creep.pickupDroppedResource(false, 40)) return true

        // 如果房间有可搬运的能量，直接去搬
        var resourceTargets: AnyStoreStructure[] = [creep.room.storage, creep.room.terminal, ...creep.room.containers].filter(item => item != undefined) as AnyStoreStructure[]
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
        } else {
            creep.memory.working = true
        }
        return true
    },
    target(creep) {
        const creepData: RemoteBuilderData = data as RemoteBuilderData
        const targetFlag = Game.flags[creepData.targetFlag]
        const targetStructure = Game.getObjectById(creepData.targetFlag) as Source
        const targetPos = targetFlag || targetStructure

        if (targetPos == undefined) return false

        if (creep.room.name != targetPos.room?.name) {
            creep.moveTo(targetPos)
            return false
        }

        if (creep.room.portals.length > 0) {
            creep.moveTo(targetPos)
            return false
        }

        if (creep.room.my && creep.room.level < 8 && creep.room.constructionSites.length == 0) {
            return RoleBaseUpgrader(creep.memory.data).target(creep)
        }
        return RoleBaseBuilder(creep.memory.data).target(creep)
    },
})
