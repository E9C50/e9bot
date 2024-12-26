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
}
