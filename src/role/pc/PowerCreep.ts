import { getDistance } from "utils";

export const powerSpawnController = function (): void {
    Object.values(Game.powerCreeps).forEach(pc => {
        const pcFlagName = 'PC_' + pc.name
        const pcFlag = Game.flags[pcFlagName]
        if (pcFlag == undefined) return

        const pcFlagTargetRoom = Game.rooms[pcFlag.pos.roomName]

        // 如果不存在，且插旗房间有powerSpawn，就生成
        if (pcFlag != undefined && pc.room == undefined) {
            if (pcFlagTargetRoom.powerSpawn == undefined) return
            pc.spawn(pcFlagTargetRoom.powerSpawn)
        }

        if (pc.room == undefined) return

        // 快死了就续命
        pc.memory.needRenew = pc.memory.needRenew || (pc.ticksToLive != undefined && pc.ticksToLive <= 500)
        if (pc.memory.needRenew) {
            const powerTarget = pc.room.powerSpawn || pc.room.powerBanks[0]
            if (getDistance(pc.pos, powerTarget.pos) > 1) {
                pc.moveTo(powerTarget)
            } else {
                pc.renew(powerTarget)
            }
            if (pc.ticksToLive != undefined && pc.ticksToLive >= 4900) {
                pc.memory.needRenew = false
            }
            return
        }

        // 不在指定房间，就过去
        if (pc.room.name != pcFlag.pos.roomName) {
            pc.moveTo(new RoomPosition(25, 25, pcFlag.pos.roomName))
            return
        }

        // OPS没了就去拿
        if (pc.store[RESOURCE_OPS] <= 200 && pc.isRoomHaveOps()) {
            pc.takeOps()
            return
        }

        // Extension填充技能
        if (pc.isPowerAvailable(PWR_OPERATE_EXTENSION)) {
            if (pc.room.energyAvailable < (pc.room.energyCapacityAvailable * 0.6)) {
                if (pc.room.storage != undefined) {
                    if (getDistance(pc.pos, pc.room.storage.pos) >= 3) {
                        pc.moveTo(pc.room.storage)
                        return
                    }
                    pc.usePower(PWR_OPERATE_EXTENSION, pc.room.storage)
                    return
                }
                if (pc.room.terminal != undefined) {
                    if (getDistance(pc.pos, pc.room.terminal.pos) >= 3) {
                        pc.moveTo(pc.room.terminal)
                        return
                    }
                    pc.usePower(PWR_OPERATE_EXTENSION, pc.room.terminal)
                    return
                }
            }
        }

        // Storage扩容技能
        if (pc.isPowerAvailable(PWR_OPERATE_STORAGE)) {
            if (pc.room.storage != undefined) {
                if (getDistance(pc.pos, pc.room.storage.pos) >= 3) {
                    pc.moveTo(pc.room.storage)
                    return
                }
                pc.usePower(PWR_OPERATE_STORAGE, pc.room.storage)
                return
            }
        }

        // Spawn加速技能
        if (pc.isPowerAvailable(PWR_OPERATE_SPAWN)) {
            for (let index in pc.room.spawns) {
                if (pc.room.spawns[index].effects == undefined || pc.room.spawns[index].effects.length == 0) {
                    if (getDistance(pc.pos, pc.room.spawns[index].pos) >= 3) {
                        pc.moveTo(pc.room.spawns[index])
                        return
                    }
                    pc.usePower(PWR_OPERATE_SPAWN, pc.room.spawns[index])
                    return
                }
            }
        }

        // Lab加速技能
        if (pc.isPowerAvailable(PWR_OPERATE_LAB)) {
            for (let index in pc.room.labs) {
                if (pc.room.labs[index].effects == undefined || pc.room.labs[index].effects.length == 0) {
                    if (getDistance(pc.pos, pc.room.labs[index].pos) >= 3) {
                        pc.moveTo(pc.room.labs[index])
                        return
                    }
                    pc.usePower(PWR_OPERATE_LAB, pc.room.labs[index])
                    return
                }
            }
        }

        // 元素矿重生技能
        if (pc.isPowerAvailable(PWR_REGEN_MINERAL) && !Memory.warMode[pc.room.name]) {
            if (pc.room.mineral != undefined && pc.room.mineral.mineralAmount > 0) {
                if (getDistance(pc.pos, pc.room.mineral.pos) >= 3) {
                    pc.moveTo(pc.room.mineral)
                    return
                }
                pc.usePower(PWR_REGEN_MINERAL, pc.room.mineral)
                return
            }
        }

        // Source重生技能
        if (pc.isPowerAvailable(PWR_REGEN_SOURCE) && !Memory.warMode[pc.room.name]) {
            for (let index in pc.room.sources) {
                if ((pc.room.sources[index].effects == undefined || pc.room.sources[index].effects.length == 0) && pc.room.sources[index].energy > 0) {
                    if (getDistance(pc.pos, pc.room.sources[index].pos) >= 3) {
                        pc.moveTo(pc.room.sources[index])
                        return
                    }
                    pc.usePower(PWR_REGEN_SOURCE, pc.room.sources[index])
                    return
                }
            }
        }

        // 没有可用技能就去旗子等
        if (getDistance(pc.pos, pcFlag.pos) > 1) {
            pc.moveTo(pcFlag)
            return
        }

        // 如果旗子位置是controller，就开启power
        if (pc.room.controller != undefined && getDistance(pc.pos, pc.room.controller.pos) == 1) {
            if (pcFlag.pos.lookFor(LOOK_STRUCTURES).filter(stru => stru.structureType == STRUCTURE_CONTROLLER).length > 0) {
                pc.enableRoom(pc.room.controller)
                return
            }
        }

        // 如果旗子位置是factory，就设置工厂等级
        if (pc.room.factory != undefined && getDistance(pc.pos, pc.room.factory.pos) == 1) {
            if (pcFlag.pos.lookFor(LOOK_STRUCTURES).filter(stru => stru.structureType == STRUCTURE_FACTORY).length > 0) {
                pc.usePower(PWR_OPERATE_FACTORY, pc.room.factory)
                return
            }
        }
    });
}
