import { getClosestTarget, getDistance } from "utils"

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
            if (creep.transfer(creep.room.storage, Object.keys(creep.store).filter(item => item != RESOURCE_ENERGY)[0] as ResourceConstant) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage)
            }
        }

        // 如果没有空余容量了，就开始工作
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true
            return false
        }

        const creepData: FillerData = data as FillerData
        const sourceTarget: Structure = Game.getObjectById(creepData.sourceId) as Structure

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

        // 优先填充Spawn和Extension
        var targets: Structure[] = []
        targets = [...creep.room.spawns, ...creep.room.extensions].filter(item => item.store.getFreeCapacity(RESOURCE_ENERGY) > 0)

        // 如果没有Spawn和Extension需要填充，则填充Storage
        if (creep.room.storage && targets.length == 0 && creepData.sourceId != creep.room.storage.id) {
            targets = [creep.room.storage].filter(item => item.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
        }

        // 如果没有Storage需要填充，则填充Tower
        if (targets.length == 0) {
            targets = creep.room.towers.filter(item => item.store.getFreeCapacity(RESOURCE_ENERGY) > 400)
        }

        // 如果没有Tower需要填充，则填充Lab
        if (targets.length == 0) {
            targets = creep.room.labs.filter(item => item.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
        }

        // 如果没有Lab需要填充，则填充Nuker
        if (targets.length == 0) {
            targets = creep.room.nuker ? [creep.room.nuker].filter(item => item.store.getFreeCapacity(RESOURCE_ENERGY) > 0) : []
        }

        // 如果没有Nuker需要填充，则填充PowerSpawn
        if (targets.length == 0) {
            targets = creep.room.powerSpawn ? [creep.room.powerSpawn].filter(item => item.store.getFreeCapacity(RESOURCE_ENERGY) > 0) : []
        }

        // 如果有需要填充的目标 就填充
        const transferTarget: Structure = getClosestTarget(creep.pos, targets)
        // const transferTarget: Structure = targets.sort((a, b) => a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep))[0]
        if (transferTarget == undefined) {
            creep.moveTo(creep.room.spawns[0])
            return true
        }

        if (creep.pos.isNearTo(transferTarget)) {
            creep.transfer(transferTarget, RESOURCE_ENERGY)
        } else {
            creep.moveTo(transferTarget)
        }
        return true
    },
})
