
export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return room.extractor != undefined && room.mineral.mineralAmount > 0
    },
    doWork: (creep: Creep) => {
        const creepData: MineralData = data as MineralData
        const sourceTarget = Game.getObjectById<Mineral>(creepData.sourceId)

        if (!sourceTarget) {
            return
        }

        // 如果不在目标位置则移动
        if (creep.store.getFreeCapacity() > 0 && !creep.pos.isNearTo(sourceTarget)) {
            creep.moveTo(sourceTarget)
            return
        }

        // 如果 extractor 在冷却中则等待
        if (creep.room.extractor?.cooldown !== 0) {
            return
        }

        // 如果身上没有矿物则采集
        if (creep.store.getFreeCapacity() > 0) {
            creep.harvest(sourceTarget)
            return
        }

        // 如果矿物满了则存放
        if (creep.room.storage) {
            if (creep.transfer(creep.room.storage, sourceTarget.mineralType) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage)
            }
        }
    },
})
