import { getDistance, getOppositePosition } from "utils"

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        const creepData: IntegrateData = data as IntegrateData
        return Game.flags[creepData.targetFlag] != undefined
    },
    prepare(creep) {
        const creepData: AttackerData = data as AttackerData
        creep.memory.needBoost = true
        if (creep.memory.needBoost) {
            // 处理boost
            const boostConfig = creep.room.memory.roomLabConfig.singleLabConfig
            for (let index in creep.body) {
                const bodyPart = creep.body[index]
                if (bodyPart.boost == undefined) {
                    for (let labId in boostConfig) {
                        if (boostConfig[labId].boostPart == bodyPart.type) {
                            const boostLab: StructureLab = Game.getObjectById(labId) as StructureLab
                            if (boostLab.mineralType == undefined || boostLab.store[boostLab.mineralType] < 100) {
                                creep.moveTo(creep.room.spawns[0])
                                return false
                            }
                            if (getDistance(creep.pos, boostLab.pos) > 1) {
                                creep.moveTo(boostLab)
                                return false
                            }
                        }
                    }
                    return false
                }
            }
            return true
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

        if (moveTarget != undefined && !creep.pos.isNearTo(moveTarget)) {
            creep.moveTo(moveTarget)
            if (creep.room.name != moveTarget.pos.roomName) return true
        }

        // 建筑在范围内就攻击
        if (!creep.room.my) {
            const structureInRange = creep.pos.findInRange(FIND_STRUCTURES, 3)
            if (structureInRange.filter(s => creep.pos.isNearTo(s.pos)).length > 0) {
                creep.rangedMassAttack()
            } else {
                creep.rangedAttack(structureInRange[0])
            }
        }

        // 获取敌人信息
        var enemyTarget: Creep | undefined = undefined
        const lastEnemy: Creep = Game.getObjectById(creepData.attackEnemy || '') as Creep
        if (lastEnemy != undefined && lastEnemy.pos.getRangeTo(creep) < 5) {
            enemyTarget = lastEnemy
        } else {
            enemyTarget = creep.room.enemies
                .filter(enemy => !enemy.my && enemy.pos.inRangeTo(creep, 5))
                .sort((a, b) => a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep))[0]
        }

        // 敌人在范围内就攻击
        if (enemyTarget != undefined) {
            const isAttack = enemyTarget.body.filter(body => body.type == 'attack').length > 0
            if (enemyTarget != undefined && creep.pos.getRangeTo(enemyTarget.pos) < 3 && isAttack) {
                creep.moveTo(getOppositePosition(creep.pos, enemyTarget.pos))
            } else {
                creep.moveTo(enemyTarget)
            }

            if (creep.pos.inRangeTo(enemyTarget, 1)) {
                creep.rangedMassAttack()
            } else if (creep.pos.inRangeTo(enemyTarget, 3)) {
                creep.rangedAttack(enemyTarget)
            }
        }

        return true
    },
})
