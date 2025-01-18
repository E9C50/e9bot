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
        var sourceTarget: StructureContainer | StructureStorage = Game.getObjectById(creepData.sourceId) as StructureContainer | StructureStorage

        if (sourceTarget == undefined) {
            sourceTarget = creep.room.containers.filter(item => item != undefined)[0]
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
        // 如果没有能量了，就切换为采集状态
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false
            return false
        }

        if (!creep.room.controller) return false

        // 升级
        const distance = getDistance(creep.pos, creep.room.controller.pos)
        if (distance > 3) {
            creep.moveTo(creep.room.controller)
        } else {
            creep.upgradeController(creep.room.controller)
            if (creep.room.terminal != undefined && getDistance(creep.pos, creep.room.terminal.pos) < 5) {
                if (getDistance(creep.pos, creep.room.terminal.pos) == 1) {
                    creep.withdraw(creep.room.terminal, RESOURCE_ENERGY)
                } else {
                    creep.moveTo(creep.room.terminal)
                }
            }
        }

        // 签名
        if (creep.room.memory.roomSignText != undefined && creep.room.controller.sign?.text != creep.room.memory.roomSignText) {
            if (distance > 1) {
                creep.moveTo(creep.room.controller)
            } else {
                creep.signController(creep.room.controller, creep.room.memory.roomSignText)
            }
        }
        return true
    },
})
