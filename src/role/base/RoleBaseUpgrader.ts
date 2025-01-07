import { getDistance } from "utils"

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

        const creepData: UpgraderData = data as UpgraderData
        var sourceTarget: Structure = Game.getObjectById(creepData.sourceId) as Structure

        if (sourceTarget == undefined) {
            sourceTarget = creep.room.containers.filter(item => item != undefined)[0]
            if (sourceTarget == undefined) {
                creep.say('❓')
                return false
            }
            creepData.sourceId = sourceTarget.id
        }

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

        if (!creep.room.controller) return false

        if (getDistance(creep.pos, creep.room.controller.pos) <= 3) {
            creep.upgradeController(creep.room.controller)
        } else {
            creep.moveTo(creep.room.controller)
        }

        return true
    },
})
