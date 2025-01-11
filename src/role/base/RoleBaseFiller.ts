import { getClosestTarget, getDistance } from "utils"

function transferToTarget(creep: Creep, transferTarget: Structure, resourceType: ResourceConstant = RESOURCE_ENERGY): boolean {
    if (transferTarget == undefined) return true
    if (getDistance(creep.pos, transferTarget.pos) <= 1) {
        creep.transfer(transferTarget, resourceType)
        return true
    } else {
        creep.moveTo(transferTarget)
        return false
    }
}

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return true
    },
    prepare: function (creep: Creep): boolean {
        return true
    },
    source(creep) {
        // 如果携带了除了能量之外的资源，就把它们都放到Storage里
        if (creep.room.storage && creep.store.getUsedCapacity() > 0) {
            const carryResourceType = Object.keys(creep.store)[0] as ResourceConstant
            if (creep.transfer(creep.room.storage, carryResourceType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage)
            }
            return true
        }

        // 如果没有空余容量了，就开始工作
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true
            return false
        }

        const creepData: FillerData = data as FillerData
        const fillJobs = creep.room.memory.roomFillJob
        var sourceTarget: Structure = Game.getObjectById(creepData.sourceId) as Structure

        if (sourceTarget == undefined) {
            sourceTarget = creep.room.containers.filter(item => item != undefined)[0]
            if (sourceTarget == undefined) {
                creep.say('❓')
                return false
            }
            creepData.sourceId = sourceTarget.id
        }

        if (creep.pickupDroppedResource(true, 40)) return true

        if (fillJobs.extension || fillJobs.nukerEnergy || fillJobs.powerSpawnEnergy
            || (fillJobs.tower && fillJobs.tower.length > 0) || (fillJobs.labInEnergy && fillJobs.labInEnergy.length > 0)) {
            // if (creep.name == 'FILLER_CD541863E8') console.log('取能量')
            if (getDistance(creep.pos, sourceTarget.pos) <= 1) {
                creep.withdraw(sourceTarget, RESOURCE_ENERGY)
                creep.memory.working = true
            } else {
                creep.moveTo(sourceTarget)
            }
            return true
        }

        if (creep.room.storage != undefined && creep.store[RESOURCE_ENERGY] > 0) {
            // if (creep.name == 'FILLER_CD541863E8') console.log('storage')
            if (getDistance(creep.pos, creep.room.storage.pos) <= 1) {
                creep.transfer(creep.room.storage, RESOURCE_ENERGY)
            } else {
                creep.moveTo(creep.room.storage)
            }
            return true
        }

        if (creep.room.storage != undefined && fillJobs.labOut != undefined && fillJobs.labOut.length > 0) {
            // if (creep.name == 'FILLER_CD541863E8') console.log('清空lab')
            const labId = fillJobs.labOut.filter(labId => Game.getObjectById<StructureLab>(labId)?.mineralType != undefined)[0]
            const lab = Game.getObjectById(labId) as StructureLab
            if (getDistance(creep.pos, lab.pos) <= 1) {
                creep.withdraw(lab, lab.mineralType as ResourceConstant)
                creep.room.memory.roomFillJob.labOut = []
                creep.memory.working = true
            } else {
                creep.moveTo(lab)
            }
            return true
        }

        if (fillJobs.labInMineral != undefined && fillJobs.labInMineral.length > 0 && creep.room.storage != undefined) {
            // if (creep.name == 'FILLER_CD541863E8') console.log('取lab')
            const lab = Game.getObjectById(fillJobs.labInMineral[0].labId) as StructureLab
            if (creep.room.storage.store[fillJobs.labInMineral[0].resourceType] > 0) {
                if (getDistance(creep.pos, creep.room.storage.pos) <= 1) {
                    creep.withdraw(creep.room.storage, fillJobs.labInMineral[0].resourceType)
                    creep.memory.working = true
                } else {
                    creep.moveTo(creep.room.storage)
                }
                return true
            }
        }

        if (fillJobs.nukerMineral && creep.room.storage && creep.room.storage.store[RESOURCE_GHODIUM] > 0) {
            // if (creep.name == 'FILLER_CD541863E8') console.log('取Nuker')
            if (getDistance(creep.pos, creep.room.storage.pos) <= 1) {
                creep.withdraw(creep.room.storage, RESOURCE_GHODIUM)
                creep.memory.working = true
            } else {
                creep.moveTo(creep.room.storage)
            }
            return true
        }

        if (fillJobs.powerSpawnPower && creep.room.storage != undefined && creep.room.storage.store[RESOURCE_POWER] > 0) {
            // if (creep.name == 'FILLER_CD541863E8') console.log('取Power')
            if (getDistance(creep.pos, creep.room.storage.pos) <= 1) {
                creep.withdraw(creep.room.storage, RESOURCE_POWER, 90)
                creep.memory.working = true
            } else {
                creep.moveTo(creep.room.storage)
            }
            return true
        }

        return true
    },
    target(creep) {
        // 如果没有能量了，就切换为采集状态
        if (creep.store.getUsedCapacity() == 0) {
            creep.memory.working = false
            return false
        }

        const creepData: FillerData = data as FillerData
        const fillJobs = creep.room.memory.roomFillJob
        const creepMineralList = Object.keys(creep.store).filter(x => x != RESOURCE_ENERGY)

        if (creep.store[RESOURCE_ENERGY] > 0 && fillJobs.extension) {
            const extensions = creep.room.extensions
            var targets: Structure[] = extensions.filter(item => item.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
            if (targets.length == 0) {
                targets = creep.room.spawns.filter(item => item.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
            }

            const target = getClosestTarget(creep.pos, targets)
            if (transferToTarget(creep, target)) {
                fillJobs.extension = false
            }
            return true
        }

        if (creep.store[RESOURCE_ENERGY] > 0 && fillJobs.tower != undefined && fillJobs.tower.length > 0) {
            fillJobs.tower = fillJobs.tower.filter(item => Game.getObjectById(item) != undefined)
            const target = getClosestTarget(creep.pos, fillJobs.tower.map(id => Game.getObjectById(id) as StructureTower))
            if (transferToTarget(creep, target)) {
                creep.room.memory.roomFillJob.tower = fillJobs.tower.filter(id => id != target.id)
            }
            return true
        }

        if (creep.room.storage != undefined && fillJobs.labOut != undefined && fillJobs.labOut.length > 0 && creepMineralList.length > 0) {
            // if (creep.name == 'FILLER_CD541863E8') console.log('labOut')
            if (transferToTarget(creep, creep.room.storage, Object.keys(creep.store)[0] as ResourceConstant)) {
                creep.room.memory.roomFillJob.labOut = []
            }
            return true
        }

        if (fillJobs.labInEnergy != undefined && fillJobs.labInEnergy.length > 0) {
            // if (creep.name == 'FILLER_CD541863E8') console.log('labInEnergy')
            const target = getClosestTarget(creep.pos, fillJobs.labInEnergy.map(id => Game.getObjectById(id) as StructureLab))
            if (transferToTarget(creep, target)) {
                creep.room.memory.roomFillJob.labInEnergy = fillJobs.labInEnergy.filter(id => id != target.id)
            }
            return true
        }

        if (fillJobs.labInMineral && creepMineralList.length > 0) {
            // if (creep.name == 'FILLER_CD541863E8') console.log('labInMineral')
            const labBoostConfig = creep.room.memory.labBoostConfig
            const targetLabs = Object.keys(labBoostConfig).filter(labId => labBoostConfig[labId].resourceType == creepMineralList[0])
            if (targetLabs.length > 0) {
                const targetLab = Game.getObjectById(targetLabs[0]) as StructureLab
                if (targetLab.mineralType == undefined || targetLab.store.getFreeCapacity(targetLab.mineralType) > 0) {
                    if (transferToTarget(creep, targetLab, creepMineralList[0] as ResourceConstant)) {
                        fillJobs.labInMineral = []
                    }
                    return true
                }
            }
        }

        if (creep.room.nuker != undefined && fillJobs.nukerEnergy) {
            // if (creep.name == 'FILLER_CD541863E8') console.log('nukerEnergy')
            if (transferToTarget(creep, creep.room.nuker)) {
                fillJobs.nukerEnergy = false
            }
            return true
        }

        if (creep.room.powerSpawn != undefined && fillJobs.powerSpawnEnergy) {
            // if (creep.name == 'FILLER_CD541863E8') console.log('powerSpawnEnergy')
            if (transferToTarget(creep, creep.room.powerSpawn)) {
                fillJobs.powerSpawnEnergy = false
            }
            return true
        }

        if (creep.room.nuker != undefined && fillJobs.nukerMineral && creep.store[RESOURCE_GHODIUM] > 0) {
            // if (creep.name == 'FILLER_CD541863E8') console.log('nukerMineral')
            if (transferToTarget(creep, creep.room.nuker, RESOURCE_GHODIUM)) {
                fillJobs.nukerMineral = false
            }
            return true
        }

        if (creep.room.powerSpawn != undefined && fillJobs.powerSpawnPower && creep.store[RESOURCE_POWER] > 0) {
            // if (creep.name == 'FILLER_CD541863E8') console.log('powerSpawn')
            if (transferToTarget(creep, creep.room.powerSpawn, RESOURCE_POWER)) {
                fillJobs.powerSpawnPower = false
            }
            return true
        }

        if (creep.room.storage && creepData.sourceId != creep.room.storage.id) {
            transferToTarget(creep, creep.room.storage)
            return true
        }

        // if (creep.name == 'FILLER_CD541863E8') console.log('没得放')
        creep.memory.working = false
        return true
    },
})
