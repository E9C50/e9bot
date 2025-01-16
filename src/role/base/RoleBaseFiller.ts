import { getClosestTarget, getDistance } from "utils"

function fillTower(creep: Creep, fillJobs: IRoomFillJob): boolean {
    // 如果有tower需要填充，那就去
    if (fillJobs.tower != undefined && fillJobs.tower.length > 0) {
        fillJobs.tower = fillJobs.tower.filter(item => Game.getObjectById(item) != undefined)
        const target = getClosestTarget(creep.pos, fillJobs.tower.map(id => Game.getObjectById(id) as StructureTower))
        if (target.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && creep.transferToTarget(target, RESOURCE_ENERGY)) {
            fillJobs.tower = []
        }
        return true
    }
    return false
}

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return true
    },
    prepare: function (creep: Creep): boolean {
        return true
    },
    source(creep) {
        const creepData: FillerData = data as FillerData
        var sourceTarget: Structure = Game.getObjectById(creepData.sourceId) as Structure

        // 如果没有空余容量了，就开始工作
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true
            return false
        }

        // 检查有没有掉落的资源需要捡
        // if (creep.pickupDroppedResource(false, 40)) return true

        // 如果没有指定目标容器，就随便找一个
        if (sourceTarget == undefined) {
            const energySources: Structure[] = [...creep.room.containers, ...creep.room.links]
                .filter(item => item != undefined && item.store[RESOURCE_ENERGY] > 0)
            if (creep.room.storage != undefined) energySources.push(creep.room.storage)

            sourceTarget = getClosestTarget(creep.pos, energySources)
            if (sourceTarget == undefined) {
                creep.say('❓')
                return false
            }
            creepData.sourceId = sourceTarget.id
        }

        // 有可用目标就去拿
        if (sourceTarget != undefined) {
            creep.takeFromTarget(sourceTarget, RESOURCE_ENERGY)
            return true
        }

        creep.say('💤')
        return true
    },
    target(creep) {
        const creepData: FillerData = data as FillerData
        const fillJobs = creep.room.memory.roomFillJob

        // 如果没有能量了，就切换为采集状态
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false
            return false
        }

        // 如果有lab需要填充，那就去
        if (fillJobs.labInEnergy != undefined && fillJobs.labInEnergy.length > 0) {
            const target = getClosestTarget(creep.pos, fillJobs.labInEnergy.map(id => Game.getObjectById(id) as StructureLab))
            if (creep.transferToTarget(target, RESOURCE_ENERGY)) {
                fillJobs.labInEnergy = []
            }
            return true
        }

        // 如果有extension需要填充，那就去
        if (fillJobs.extension) {
            if (creepData.targetId == undefined) {
                const targets: Structure[] = [...creep.room.extensions, ...creep.room.spawns].filter(item => item.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
                const closestTareget = getClosestTarget(creep.pos, targets)
                if (closestTareget != undefined) {
                    creepData.targetId = closestTareget.id
                }
            }
            if (creepData.targetId != undefined) {
                const target = Game.getObjectById(creepData.targetId) as Structure
                if (creep.transferToTarget(target, RESOURCE_ENERGY)) {
                    fillJobs.extension = false
                    creepData.targetId = undefined
                }
            }
            return true
        }

        // 如果有nuker需要填充，那就去
        if (creep.room.nuker != undefined && fillJobs.nukerEnergy) {
            if (creep.transferToTarget(creep.room.nuker, RESOURCE_ENERGY)) {
                fillJobs.nukerEnergy = false
            }
            return true
        }

        // 如果有powerSpawn需要填充，那就去
        if (creep.room.powerSpawn != undefined && fillJobs.powerSpawnEnergy) {
            if (creep.transferToTarget(creep.room.powerSpawn, RESOURCE_ENERGY)) {
                fillJobs.powerSpawnEnergy = false
            }
            return true
        }

        // 如果不是从storage搬运，那就放到storage
        if (creep.room.storage != undefined && creepData.sourceId != creep.room.storage.id) {
            creep.transferToTarget(creep.room.storage, RESOURCE_ENERGY)
            return true
        }

        if (fillTower(creep, fillJobs)) return true

        if (getDistance(creep.pos, creep.room.spawns[0].pos) > 1) {
            creep.moveTo(creep.room.spawns[0])
            return true
        }

        creep.say('💤')
        return true
    },
})
