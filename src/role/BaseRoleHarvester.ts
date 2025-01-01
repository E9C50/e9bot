export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return true
    },
    doWork: (creep: Creep) => {
        const creepData: HarvesterData = data as HarvesterData
        const sourceTarget = Game.getObjectById<Source>(creepData.sourceId)

        if (!sourceTarget) {
            creep.say('❓')
            return
        }

        // 如果不在目标位置则移动
        if (!creep.pos.isNearTo(sourceTarget)) {
            creep.moveTo(sourceTarget);
            return;
        }

        // 如果身上没有能量则采集
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.harvest(sourceTarget);
            return;
        }

        // 获取周围建筑
        const link = creep.room.links.filter(item => creep.pos.getRangeTo(item) <= 2)[0];
        const container = creep.room.containers.filter(item => creep.pos.getRangeTo(item) <= 2)[0];
        const constructionSite = creep.room.constructionSites.filter(item => creep.pos.getRangeTo(item) <= 2)[0];

        // 如果有工地则建设
        if (constructionSite) {
            creep.build(constructionSite);
            return;
        }

        // 如果容器生命值不足则维修
        if (container && container.hits < container.hitsMax) {
            creep.repair(container);
            return;
        }

        // 如果有link则存放；如果有容器则存放
        if (link && link.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            creep.transfer(link, RESOURCE_ENERGY);
            return;
        } else if (container && container.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            creep.transfer(container, RESOURCE_ENERGY);
            return;
        } else {
            creep.say('💤');
        }
    },
})
