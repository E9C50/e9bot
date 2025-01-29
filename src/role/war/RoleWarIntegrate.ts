import { getOppositePosition } from "utils"

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        const creepData: IntegrateData = data as IntegrateData
        return Game.flags[creepData.targetFlag] != undefined
    },
    prepare(creep) {
        creep.memory.needBoost = true
        if (!creep.memory.ready && creep.memory.needBoost) {
            return creep.goBoost()
        }
        return true
    },
    source(creep) {
        creep.memory.working = true
        return true
    },
    target(creep) {
        const creepData: IntegrateData = data as IntegrateData
        const targetFlag: Flag = Game.flags[creepData.targetFlag]
        const enemySource = Game.getObjectById(creepData.targetFlag) as Source
        const moveTarget = targetFlag || enemySource

        // 治疗自己
        if (creep.hits < creep.hitsMax) {
            creep.heal(creep)
        }

        // 获取友军并治疗
        const myCreeps = creep.pos.findInRange(FIND_MY_CREEPS, 3, { filter: x => x.hits < x.hitsMax })
        if (myCreeps.length > 0) {
            myCreeps.sort((a, b) => a.hits - b.hits)
            if (creep.pos.isNearTo(myCreeps[0])) {
                creep.heal(myCreeps[0])
            } else {
                creep.rangedHeal(myCreeps[0])
            }
        }

        if (moveTarget != undefined && !creep.pos.isEqualTo(moveTarget)) {
            creep.moveTo(targetFlag)
            if (creep.room.name != moveTarget.pos.roomName) return true
        }

        // 建筑在范围内就攻击
        if (!creep.room.my) {
            const structureInRange = creep.pos.findInRange(FIND_STRUCTURES, 3)
            if (structureInRange.filter(s => creep.pos.isNearTo(s.pos)).length > 0
                && structureInRange[0].structureType != STRUCTURE_ROAD
                && structureInRange[0].structureType != STRUCTURE_CONTAINER
                && structureInRange[0].structureType != STRUCTURE_CONTROLLER) {
                creep.rangedMassAttack()
            } else {
                creep.rangedAttack(structureInRange[0])
            }
        }

        // 获取敌人信息
        var enemyTarget: Creep | undefined = undefined
        const lastEnemy: Creep = Game.getObjectById(creepData.attackEnemy || '') as Creep
        if (lastEnemy != undefined && lastEnemy.pos.getRangeTo(creep) < 10) {
            enemyTarget = lastEnemy
        } else {
            enemyTarget = creep.room.enemies
                .filter(enemy => !enemy.my && enemy.pos.inRangeTo(creep, 10))
                .sort((a, b) => a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep))[0]
        }

        // 敌人在范围内就攻击
        if (enemyTarget != undefined) {
            const isAttack = enemyTarget.body.filter(body => body.type == 'attack').length > 0
            if (enemyTarget != undefined && creep.pos.getRangeTo(enemyTarget.pos) < 3 && isAttack) {
                creep.moveTo(getOppositePosition(creep.pos, enemyTarget.pos))
            } else {
                creep.moveTo(targetFlag)
            }

            if (creep.pos.inRangeTo(enemyTarget, 1)) {
                creep.rangedMassAttack()
                // if (creep.room.my) {
                //     creep.room.towers.forEach(tower => {
                //         if (enemyTarget != undefined) tower.attack(enemyTarget)
                //     })
                // }
            } else if (creep.pos.inRangeTo(enemyTarget, 3)) {
                creep.rangedAttack(enemyTarget)
                // if (creep.room.my) {
                //     creep.room.towers.forEach(tower => {
                //         if (enemyTarget != undefined) tower.attack(enemyTarget)
                //     })
                // }
            }
            creep.moveTo(enemyTarget)
        }


        return true
    },
})
