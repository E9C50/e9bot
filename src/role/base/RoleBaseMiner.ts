import { getDistance } from "utils"

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return room.extractor != undefined && room.mineral.mineralAmount > 0
    },
    prepare(creep) {
        return true
    },
    source(creep) {
        const creepData: MineralData = data as MineralData
        const sourceTarget = Game.getObjectById<Mineral>(creepData.sourceId)
        if (!sourceTarget) {
            return false
        }

        // 如果没有空余容量了，就开始工作
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true
            return false
        }

        // 如果不在旁边，那就过去
        if (getDistance(creep.pos, sourceTarget.pos) > 1) {
            creep.moveTo(sourceTarget)
            return false
        }

        // 如果 extractor 在冷却中则等待
        if (creep.room.extractor?.cooldown !== 0) {
            return false
        }

        // 采集矿物
        creep.harvest(sourceTarget)
        return true
    },
    target(creep) {
        const creepData: MineralData = data as MineralData
        const sourceTarget = Game.getObjectById<Mineral>(creepData.sourceId)
        if (!sourceTarget) {
            return false
        }

        // 如果没有矿物了，就切换为采集状态
        if (creep.store[sourceTarget.mineralType] == 0) {
            creep.memory.working = false
            return false
        }

        // 如果矿物满了则存放
        if (creep.room.storage) {
            creep.transferToTarget(creep.room.storage, sourceTarget.mineralType)
        }

        return true
    },
})
