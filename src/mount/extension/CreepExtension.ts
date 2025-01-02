export default class CreepExtension extends Creep {
    /**
     * 从目标结构获取能量
     *
     * @param target 提供能量的结构
     * @returns 执行 harvest 或 withdraw 后的返回值
     */
    public getEnergyFrom(target: Structure | Source): ScreepsReturnCode {
        let result: ScreepsReturnCode
        if (target instanceof Structure) {
            result = this.withdraw(target as Structure, RESOURCE_ENERGY)
        } else {
            result = this.harvest(target as Source)
        }

        if (result === ERR_NOT_IN_RANGE) this.moveTo(target.pos)
        return result
    }

    /**
     * 建设房间内存在的建筑工地
     */
    public buildStructure(): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH | ERR_NOT_FOUND {
        const target = this.room.constructionSites[0]
        if (!target) return ERR_NOT_FOUND

        // 建设
        const buildResult = this.build(target)
        if (buildResult == ERR_NOT_IN_RANGE) this.moveTo(target.pos)
        return buildResult
    }

    /**
     * 捡起地上的资源
     * @param allSource
     * @param range
     * @returns
     */
    public pickupDroppedResource(allSource: boolean, range: number): boolean {
        // 没有携带空间的跳过
        if (this.store.getFreeCapacity() == 0) return false

        // 优先捡起附近掉落的资源
        const droppedEnergy = this.room.droppedResource.filter(resource => resource.pos.inRangeTo(this.pos, range));

        if (droppedEnergy.length > 0 && droppedEnergy[0].amount > 100) {
            this.say('🔄');
            if (this.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
                this.moveTo(droppedEnergy[0]);
            }
            return true;
        }

        // 查找附近的墓碑和废墟
        const tombstones: Tombstone[] = this.room.tombstones.filter(tombstone =>
            tombstone.pos.inRangeTo(this.pos, range) && tombstone.store.getUsedCapacity() > 0
        );
        const ruins: Ruin[] = this.room.ruins.filter(ruin =>
            ruin.pos.inRangeTo(this.pos, range) && ruin.store.getUsedCapacity() > 0
        );
        const destroyed: (Tombstone | Ruin)[] = [...ruins, ...tombstones];

        // 捡取资源
        if (destroyed.length > 0) {
            this.say('🔄');
            for (let resource in destroyed[0].store) {
                if (resource != RESOURCE_ENERGY && !allSource) {
                    continue;
                }
                if (this.withdraw(destroyed[0], resource as ResourceConstant) == ERR_NOT_IN_RANGE) {
                    this.moveTo(destroyed[0]);
                }
            }
            return true;
        }
        return false;
    }
}
