export default class TowerExtension extends StructureTower {
    public init(): void {
        if (!this.room.memory.roomFillJob.tower) this.room.memory.roomFillJob.tower = []
        if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && !this.room.memory.roomFillJob.tower.includes(this.id)) {
            this.room.memory.roomFillJob.tower.push(this.id)
        }
    }

    public doWork(): void {
        if (Memory.warMode[this.room.name]) return
        var towerEnergy = this.store[RESOURCE_ENERGY];

        // 检测需要治疗的单位
        // var needHealCreep = [...Object.values(Game.creeps), ...Object.values(Game.powerCreeps)]
        //     .filter(creep => creep.room != undefined && creep.room.name == this.room.name && creep.hits < creep.hitsMax)[0]
        // if (needHealCreep) {
        //     this.heal(needHealCreep);
        //     return
        // }

        // 检测敌人并攻击，优先攻击治疗单位 -> 远程攻击单位 -> 攻击单位 -> 其他
        if (this.room.memory.npcTarget != undefined) {
            var enemy: Creep = Game.getObjectById(this.room.memory.npcTarget) as Creep
            if (enemy != undefined) {
                this.attack(enemy);
                return
            }
        }

        // if (this.id != this.room.memory.roomStructurePos.towerAllowRepair || towerEnergy < 500) return

        // 如果没有敌人，尝试修复建筑物，优先除墙外的血量最低的建筑，其次修墙
        // var structure = this.room.structuresNeedRepair[0]
        // if (!structure && this.room.memory.enableTowerRepairWall && this.store[RESOURCE_ENERGY] > 500) {
        //     structure = this.room.wallsNeedRepair[0]
        // }
        // if (structure) {
        //     this.repair(structure);
        //     return
        // }
    }
}
