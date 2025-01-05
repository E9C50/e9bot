export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return true
    },
    doWork: (creep: Creep) => {
        const creepData: RemoteHarvesterData = data as RemoteHarvesterData

        if (creep.room.name != creepData.targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, creepData.targetRoom))
            return
        }

        const targetSource = creep.room.sources.filter(source => source.id == creepData.sourceId)[0]
        if (creep.harvest(targetSource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targetSource)
            return
        }

        // 挖矿
        if (targetSource.energyCapacity > 0) creep.harvest(targetSource)

        // 如果有container则存放
        const container = creep.room.containers.filter(item => creep.pos.isNearTo(item))[0]
        if (container && container.hits < container.hitsMax) {
            creep.repair(container)
            return
        }
        if (container && container.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            creep.transfer(container, RESOURCE_ENERGY)
            return
        }

        // 如果有工地则建造
        const constructionSite = creep.room.constructionSites.filter(item => creep.pos.getRangeTo(item) <= 2)[0]
        if (constructionSite) {
            creep.build(constructionSite)
            return
        }
    },
})
