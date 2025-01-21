import { boostTypeEnum } from "settings"
import { getClosestTarget, getDistance } from "utils"

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return true
    },
    prepare(creep) {
        // if (creep.room.name == 'E37N7' && creep.ticksToLive != undefined && creep.ticksToLive > 1000) {
        //     return creep.goBoost([boostTypeEnum.BoostTypeUpgrade])
        // }
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
        // 如果没有能量了，就切换为采集状态
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false
            return false
        }

        if (!creep.room.controller) return false

        // 升级
        const distance = getDistance(creep.pos, creep.room.controller.pos)
        if (distance > 3) {
            if (creep.room.terminal != undefined && getDistance(creep.room.terminal.pos, creep.room.controller.pos) < 5) {
                creep.moveTo(creep.room.terminal)
            } else {
                creep.moveTo(creep.room.controller)
            }
        } else {
            creep.upgradeController(creep.room.controller)
            if (creep.room.terminal != undefined && getDistance(creep.pos, creep.room.terminal.pos) < 5) {
                if (getDistance(creep.pos, creep.room.terminal.pos) == 1) {
                    if (creep.pos.x != creep.room.terminal.pos.x && creep.pos.y != creep.room.terminal.pos.y) {
                        creep.room.terminal.pos.getFreeSpace().forEach(space => {
                            if (creep.room.terminal != undefined && !creep.room.terminal.pos.isEqualTo(space) && space.lookFor(LOOK_CREEPS).length == 0 &&
                                (space.x == creep.room.terminal.pos.x || space.y == creep.room.terminal.pos.y)) {
                                creep.moveTo(space)
                            }
                        })
                    }
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
