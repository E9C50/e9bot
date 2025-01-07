import { getClosestTarget, getDistance } from "utils"

function transferToTarget(creep: Creep, transferTarget: Structure): boolean {
    if (transferTarget == undefined) return true
    if (getDistance(creep.pos, transferTarget.pos) <= 1) {
        creep.transfer(transferTarget, RESOURCE_ENERGY)
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
        if (creep.room.storage && creep.store.getUsedCapacity() > creep.store[RESOURCE_ENERGY]) {
            const carryResourceType = Object.keys(creep.store).filter(item => item != RESOURCE_ENERGY)[0] as ResourceConstant
            if (creep.transfer(creep.room.storage, carryResourceType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage)
                return true
            }
        }

        // 如果没有空余容量了，就开始工作
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true
            return false
        }

        const creepData: FillerData = data as FillerData
        var sourceTarget: Structure = Game.getObjectById(creepData.sourceId) as Structure

        if (sourceTarget == undefined) {
            sourceTarget = creep.room.containers.filter(item => item != undefined)[0]
            if (sourceTarget == undefined) {
                creep.say('❓')
                return false
            }
            creepData.sourceId = sourceTarget.id
        }

        if (creep.pickupDroppedResource(true, 10)) return true

        if (getDistance(creep.pos, sourceTarget.pos) <= 1) {
            creep.withdraw(sourceTarget, RESOURCE_ENERGY)
        } else {
            creep.moveTo(sourceTarget)
        }

        return true
    },
    target(creep) {
        // 如果没有能量了，就切换为采集状态
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false
            return false
        }

        const creepData: FillerData = data as FillerData
        const fillJobs = creep.room.memory.roomFillJob

        if (fillJobs.extension) {
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

        if (fillJobs.tower != undefined && fillJobs.tower.length > 0) {
            fillJobs.tower = fillJobs.tower.filter(item => Game.getObjectById(item) != undefined)
            const target = getClosestTarget(creep.pos, fillJobs.tower.map(id => Game.getObjectById(id) as StructureTower))
            if (transferToTarget(creep, target)) {
                creep.room.memory.roomFillJob.tower = fillJobs.tower.filter(id => id != target.id)
            }
            return true
        }

        if (fillJobs.labInEnergy != undefined && fillJobs.labInEnergy.length > 0) {
            const target = getClosestTarget(creep.pos, fillJobs.labInEnergy.map(id => Game.getObjectById(id) as StructureLab))
            if (transferToTarget(creep, target)) {
                creep.room.memory.roomFillJob.labInEnergy = fillJobs.labInEnergy.filter(id => id != target.id)
            }
            return true
        }

        if (creep.room.nuker != undefined && fillJobs.nukerEnergy) {
            if (transferToTarget(creep, creep.room.nuker)) {
                fillJobs.nukerEnergy = false
            }
            return true
        }

        if (creep.room.powerSpawn != undefined && fillJobs.powerSpawnEnergy) {
            if (transferToTarget(creep, creep.room.powerSpawn)) {
                fillJobs.powerSpawnEnergy = false
            }
            return true
        }

        if (creep.room.storage && creepData.sourceId != creep.room.storage.id) {
            transferToTarget(creep, creep.room.storage)
            return true
        }

        if (getDistance(creep.pos, creep.room.spawns[0].pos) > 2) {
            creep.moveTo(creep.room.spawns[0])
        }

        return true
    },
})
