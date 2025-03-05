export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return room.level > 6 && room.labs.length > 0
    },
    prepare(creep) {
        return true
    },
    source(creep) {
        const fillJobs = creep.room.memory.roomFillJob

        // 检查有没有掉落的资源需要捡
        // if (creep.pickupDroppedResource(true, 40)) return true

        // 身上有东西就先放下
        if (creep.room.storage != undefined && creep.store.getUsedCapacity() > 0) {
            creep.transferToTarget(creep.room.storage, Object.keys(creep.store)[0] as ResourceConstant)
            return true
        }

        // 优先搬出来lab不需要的东西
        if (creep.room.storage != undefined && fillJobs.labOut != undefined && fillJobs.labOut.length > 0) {
            const labId = fillJobs.labOut.filter(labId => Game.getObjectById<StructureLab>(labId)?.mineralType != undefined)[0]
            const lab = Game.getObjectById(labId) as StructureLab
            if (creep.takeFromTarget(lab, lab.mineralType as ResourceConstant)) {
                creep.memory.working = true
                fillJobs.labOut = []
            }
            return true
        }

        // 去拿Lab需要的元素
        if (fillJobs.labInMineral != undefined && fillJobs.labInMineral.length > 0) {
            const resourceType = fillJobs.labInMineral[0].resourceType
            if (creep.room.storage != undefined && creep.room.storage.store[resourceType] > 0) {
                let takeAmount = 0
                const targetLab = Game.getObjectById(fillJobs.labInMineral[0].labId) as StructureLab
                const singleLabConfig = creep.room.memory.roomLabConfig.singleLabConfig[fillJobs.labInMineral[0].labId]
                if (singleLabConfig != undefined && singleLabConfig.boostMode) {
                    takeAmount = creep.room.memory.boostNeed[resourceType] - targetLab.store[resourceType]
                }
                if (creep.takeFromTarget(creep.room.storage, resourceType, takeAmount)) {
                    creep.memory.working = true
                }
                return true
            } else {
                const labId = fillJobs.labInMineral[0].labId
                fillJobs.labInMineral = fillJobs.labInMineral.filter(job => job.labId != labId)
            }
        }

        // 去拿核弹需要的G
        if (fillJobs.nukerMineral && creep.room.storage && creep.room.storage.store[RESOURCE_GHODIUM] > 0) {
            if (creep.takeFromTarget(creep.room.storage, RESOURCE_GHODIUM)) {
                creep.memory.working = true
                // fillJobs.nukerMineral = false
            }
            return true
        }

        // 去拿Power
        if (fillJobs.powerSpawnPower && creep.room.storage != undefined && creep.room.storage.store[RESOURCE_POWER] > 0) {
            const takeAmount = Math.min(90, creep.room.storage.store[RESOURCE_POWER])
            if (creep.takeFromTarget(creep.room.storage, RESOURCE_POWER, takeAmount)) {
                creep.memory.working = true
                // fillJobs.powerSpawnPower = false
            }
            return true
        }

        return true
    },
    target(creep) {
        const fillJobs = creep.room.memory.roomFillJob

        // 如果lab需要物资，判断是否已经携带，如果携带就送过去
        if (fillJobs.labInMineral) {
            const labInMineral = creep.room.memory.roomFillJob.labInMineral
            for (let index in labInMineral) {
                const targetLab = Game.getObjectById(labInMineral[index].labId) as StructureLab
                if (targetLab == undefined || creep.store[labInMineral[index].resourceType] == 0) continue
                if (targetLab.mineralType == undefined || targetLab.store.getFreeCapacity(targetLab.mineralType) > 0) {
                    if (creep.transferToTarget(targetLab, labInMineral[index].resourceType)) {
                        fillJobs.labInMineral = fillJobs.labInMineral.filter(job => job.labId != targetLab.id)
                        creep.memory.working = false
                    }
                    return true
                }
            }
        }

        // 如果nuker需要G，并且已经携带，就送过去
        if (creep.room.nuker != undefined && fillJobs.nukerMineral && creep.store[RESOURCE_GHODIUM] > 0) {
            if (creep.transferToTarget(creep.room.nuker, RESOURCE_GHODIUM)) {
                fillJobs.nukerMineral = false
                creep.memory.working = false
            }
            return true
        }

        // 如果需要Power，并且已经携带，就送过去
        if (creep.room.powerSpawn != undefined && fillJobs.powerSpawnPower && creep.store[RESOURCE_POWER] > 0) {
            if (creep.transferToTarget(creep.room.powerSpawn, RESOURCE_POWER)) {
                fillJobs.powerSpawnPower = false
                creep.memory.working = false
            }
            return true
        }

        // 如果携带了其他东西，就放回容器
        if (creep.room.storage != undefined) {
            if (creep.transferToTarget(creep.room.storage, creep.store[0])) {
                creep.memory.working = false
            }
            return true
        }

        return true
    },
})
