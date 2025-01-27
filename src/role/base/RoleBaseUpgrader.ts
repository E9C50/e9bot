import { getClosestTarget, getDistance } from "utils"

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
        var sourceTarget: AnyStoreStructure = Game.getObjectById(creepData.sourceId) as AnyStoreStructure

        if (sourceTarget == undefined || sourceTarget.store[RESOURCE_ENERGY] == 0) {
            var anyStoreStructure: AnyStoreStructure[] = [...creep.room.containers]
            if (creep.room.storage != undefined) anyStoreStructure.push(creep.room.storage)
            if (creep.room.terminal != undefined) anyStoreStructure.push(creep.room.terminal)
            anyStoreStructure = anyStoreStructure.filter(item => item != undefined && item.store[RESOURCE_ENERGY] > 0)
            sourceTarget = getClosestTarget(creep.pos, anyStoreStructure)
            if (sourceTarget == undefined) {
                creep.say('❓')
                return false
            }
            creepData.sourceId = sourceTarget.id
        }

        if (sourceTarget.store[RESOURCE_ENERGY] == 0) {
            creep.say("💤")
            return true
        }

        if (getDistance(creep.pos, sourceTarget.pos) <= 1) {
            creep.withdraw(sourceTarget, RESOURCE_ENERGY)
        } else {
            creep.moveTo(sourceTarget)
        }

        return true
    },
    target(creep) {
        const fixPos = Game.flags[creep.name]
        if (fixPos && !creep.pos.isEqualTo(fixPos)) {
            creep.moveTo(fixPos)
            return false
        }
        // 如果没有能量了，就切换为采集状态
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false
            return false
        }

        if (!creep.room.controller) return false

        // 升级
        const distanceController = getDistance(creep.pos, creep.room.controller.pos)
        if (distanceController > 3) {
            if (creep.room.terminal != undefined && getDistance(creep.room.terminal.pos, creep.room.controller.pos) < 5) {
                creep.moveTo(creep.room.terminal)
            } else {
                creep.moveTo(creep.room.controller)
            }
        } else {
            creep.upgradeController(creep.room.controller)
            if (creep.room.terminal != undefined && creep.pos.isNearTo(creep.room.terminal)) {
                creep.withdraw(creep.room.terminal, RESOURCE_ENERGY)
            }
            if (creep.room.storage != undefined && creep.pos.isNearTo(creep.room.storage)) {
                creep.withdraw(creep.room.storage, RESOURCE_ENERGY)
            }
        }

        // 签名
        if (creep.room.memory.roomSignText != undefined && creep.room.controller.sign?.text != creep.room.memory.roomSignText) {
            if (distanceController > 1) {
                creep.moveTo(creep.room.controller)
            } else {
                creep.signController(creep.room.controller, creep.room.memory.roomSignText)
            }
        }
        return true
    },
})
