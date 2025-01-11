import { getDistance } from "utils"

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        const creepData: IntegrateData = data as IntegrateData
        return Game.flags[creepData.targetFlag] != undefined
    },
    prepare(creep) {
        const creepData: AttackerData = data as AttackerData
        // creep.memory.needBoost = true
        if (creep.memory.needBoost) {
            const boostConfig = creep.room.memory.labBoostConfig
            if (boostConfig == undefined) {
                creep.say('❓')
                return false
            }

            // 处理boost
            for (let index in creep.body) {
                const bodyPart = creep.body[index]
                if (bodyPart.boost == undefined) {
                    for (let labId in boostConfig) {
                        if (boostConfig[labId].bodyPart == bodyPart.type) {
                            const boostLab: StructureLab = Game.getObjectById(labId) as StructureLab
                            if (getDistance(creep.pos, boostLab.pos) > 1) {
                                creep.moveTo(boostLab)
                            }
                        }
                    }
                    return false
                }
            }

            return true
        }

        if (creepData.team != undefined) {
            // 处理组队逻辑
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
        if (targetFlag == undefined) return false

        if (creep.hits < creep.hitsMax) {
            creep.heal(creep)
        }

        const myCreeps = creep.pos.findInRange(FIND_MY_CREEPS, 3, { filter: x => x.hits < x.hitsMax })
        if (myCreeps.length > 0) {
            if (creep.pos.isNearTo(myCreeps[0])) {
                creep.heal(myCreeps[0])
            } else {
                creep.rangedHeal(myCreeps[0])
            }
        }

        // 获取敌人信息
        var enemyTarget: Creep | undefined = undefined
        const lastEnemy: Creep = Game.getObjectById(creepData.attackEnemy || '') as Creep
        if (lastEnemy != undefined && lastEnemy.pos.getRangeTo(creep) < 10) {
            enemyTarget = lastEnemy
        } else {
            enemyTarget = creep.room.enemies
                .filter(enemy => !enemy.my && enemy.pos.inRangeTo(creep, 3))
                .sort((a, b) => a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep))[0]
        }

        // 敌人在范围内就攻击
        if (enemyTarget != undefined && creep.pos.inRangeTo(enemyTarget, 3)) {
            creep.rangedAttack(enemyTarget)
            creepData.attackEnemy = enemyTarget.id
        }

        // 不在目标房那就过去
        const structure = creep.room.name == targetFlag.pos.roomName ?
            targetFlag.pos.lookFor(LOOK_STRUCTURES)[0] : undefined

        if (creep.room.name != targetFlag.pos.roomName) {
            creep.moveTo(targetFlag)
            return true
        }

        var moveTarget: RoomPosition | undefined = undefined
        // 附近有敌人就追上去
        if (enemyTarget != undefined) {
            moveTarget = enemyTarget.pos
        }

        // 标点有建筑就去拆建筑
        if (enemyTarget == undefined && structure != undefined) {
            moveTarget = structure.pos
        }

        // 两个都没有就去Flag待命
        if (enemyTarget == undefined && structure == undefined) {
            moveTarget = targetFlag.pos
        }

        // 向目标移动
        if (moveTarget != undefined) creep.moveTo(moveTarget)


        // 建筑在范围内就攻击
        if (structure != undefined && creep.pos.inRangeTo(structure, 3)) {
            creep.rangedAttack(structure)
        }

        return true
    },
})
