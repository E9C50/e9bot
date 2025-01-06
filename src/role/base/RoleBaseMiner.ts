
export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return room.extractor != undefined && room.mineral.mineralAmount > 0
    },
    prepare(creep) {
        const creepData: MineralData = data as MineralData
        const sourceTarget = Game.getObjectById<Mineral>(creepData.sourceId)
        if (!sourceTarget) {
            return false
        }

        // 如果不在目标位置则移动
        if (!creep.memory.ready) {
            if (!creep.pos.isNearTo(sourceTarget)) {
                creep.moveTo(sourceTarget)
                return false
            } else {
                creep.memory.ready = true
                return true
            }
        } else {
            return true
        }
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

        // 如果 extractor 在冷却中则等待
        if (creep.room.extractor?.cooldown !== 0) {
            return true
        }

        // 采集矿物
        creep.harvest(sourceTarget)
        return true
    },
    target(creep) {
        // 如果没有能量了，就切换为采集状态
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false
            return false
        }

        const creepData: MineralData = data as MineralData
        const sourceTarget = Game.getObjectById<Mineral>(creepData.sourceId)
        if (!sourceTarget) {
            return false
        }

        // 如果矿物满了则存放
        if (creep.room.storage) {
            if (creep.pos.isNearTo(creep.room.storage)) {
                creep.transfer(creep.room.storage, sourceTarget.mineralType)
            } else {
                creep.moveTo(creep.room.storage)
            }
        }

        return true
    },
})
