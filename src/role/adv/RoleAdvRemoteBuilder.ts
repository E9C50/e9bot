import RoleBaseBuilder from "role/base/RoleBaseBuilder"
import RoleBaseUpgrader from "role/base/RoleBaseUpgrader";
import { getClosestTarget, getDistance } from "utils"

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return true
    },
    prepare(creep) {
        // if (creep.room.name == 'E35N3') creep.memory.needBoost = true
        // if (creep.memory.needBoost) {
        //     // 处理boost
        //     const boostConfig = creep.room.memory.roomLabConfig.singleLabConfig
        //     for (let index in creep.body) {
        //         const bodyPart = creep.body[index]
        //         if (bodyPart.boost == undefined) {
        //             for (let labId in boostConfig) {
        //                 if (boostConfig[labId].boostPart == bodyPart.type) {
        //                     const boostLab: StructureLab = Game.getObjectById(labId) as StructureLab
        //                     if (boostLab.mineralType == undefined || boostLab.store[boostLab.mineralType] < 100 || boostLab.store[RESOURCE_ENERGY] < 100) {
        //                         creep.moveTo(creep.room.spawns[0])
        //                         return false
        //                     }
        //                     if (getDistance(creep.pos, boostLab.pos) > 1) {
        //                         creep.moveTo(boostLab)
        //                         return false
        //                     }
        //                 }
        //             }
        //             return false
        //         }
        //     }
        //     return true
        // }
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

        if (creep.room.name != targetPos.room?.name) {
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
