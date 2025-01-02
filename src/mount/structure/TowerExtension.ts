

export default class TowerExtension extends StructureTower {
    private findEnemy(): Creep {
        var enemys = this.room.enemies.filter(creep => creep.body.some(part => part.type === RANGED_ATTACK))

        if (!enemys) {
            enemys = this.room.enemies.filter(creep => creep.body.some(part => part.type === ATTACK))
        }
        if (!enemys) {
            enemys = this.room.enemies.filter(creep => creep.body.some(part => part.type === HEAL))
        }
        if (!enemys) {
            enemys = this.room.enemies
        }

        // 按照距离排序
        enemys.sort((a, b) => this.pos.getRangeTo(a) - this.pos.getRangeTo(b))
        return enemys[0]
    }

    private findStructureToRepair(): Structure {
        var structureToRepair = this.room.structures
            .filter(structure => structure.hits < structure.hitsMax
                && structure.structureType !== STRUCTURE_WALL
                && structure.structureType !== STRUCTURE_RAMPART)
            .sort((a, b) => a.hits - b.hits)[0];

        if (!structureToRepair && this.room.memory.enableTowerRepairWall) {
            structureToRepair = this.room.structures
                .filter(structure => structure.hits < structure.hitsMax)
                .sort((a, b) => a.hits - b.hits)[0];
        }
        return structureToRepair;
    }

    public doWork(): void {
        var towerEnergy = this.store[RESOURCE_ENERGY];

        // 检测敌人并攻击，优先攻击治疗单位 -> 远程攻击单位 -> 攻击单位 -> 其他
        var enemy = this.findEnemy();
        if (enemy) {
            this.attack(enemy);
            return
        }

        // 检测需要治疗的单位
        var needHealCreep = this.pos.findClosestByRange(FIND_MY_CREEPS, { filter: creep => creep.hits < creep.hitsMax });
        if (needHealCreep) {
            this.heal(needHealCreep);
            return;
        }

        // 只有energy大于500时，才会修复建筑物/治疗单位（储备弹药优先攻击敌人）
        if (towerEnergy < 500) {
            return;
        }

        // 如果没有敌人，尝试修复建筑物，优先除墙外的血量最低的建筑，其次修墙
        var structure = this.findStructureToRepair();
        if (structure) {
            this.repair(structure);
            return;
        }
    }
}
