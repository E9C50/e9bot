export default class CreepHarvester extends Creep {
    public doWork(): void {
        const creepData: HarvesterData = this.memory.data as HarvesterData
        const sourceTarget = Game.getObjectById(creepData.sourceId) as Source

        // 如果不在目标位置则移动
        if (!this.pos.isNearTo(sourceTarget)) {
            this.moveTo(sourceTarget);
            return;
        }

        // 如果身上没有能量则采集
        if (this.store[RESOURCE_ENERGY] == 0) {
            this.harvest(sourceTarget);
            return;
        }

        // 获取周围建筑
        const link = this.room.links.filter(item => this.pos.getRangeTo(item) <= 2)[0];
        const container = this.room.containers.filter(item => this.pos.getRangeTo(item) <= 2)[0];
        const constructionSite = this.room.constructionSites.filter(item => this.pos.getRangeTo(item) <= 2)[0];

        // 如果有工地则建设
        if (constructionSite) {
            this.build(constructionSite);
            return;
        }

        // 如果容器生命值不足则维修
        if (container && container.hits < container.hitsMax) {
            this.repair(container);
            return;
        }

        // 如果有link则存放
        if (link) {
            this.transfer(link, RESOURCE_ENERGY);
            return;
        }


        // 如果有容器则存放
        if (container) {
            this.transfer(container, RESOURCE_ENERGY);
            return;
        }
    }
}
