export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        const creepData: IntegrateData = data as IntegrateData
        return Game.flags[creepData.targetFlag] != undefined
    },
    doWork: (creep: Creep) => {
        const creepData: IntegrateData = data as IntegrateData
        const targetFlag: Flag = Game.flags[creepData.targetFlag]
        if (targetFlag == undefined) return

        if (creep.hits < creep.hitsMax) {
            creep.heal(creep)
        }

        var enemyTarget: Creep | undefined = undefined

        const lastEnemy: Creep = Game.getObjectById(creepData.attackEnemy || '') as Creep
        if (lastEnemy != undefined && lastEnemy.pos.getRangeTo(creep) < 10) {
            enemyTarget = lastEnemy
        } else {
            enemyTarget = creep.room.enemies
                .filter(enemy => !enemy.my && enemy.pos.inRangeTo(creep, 3))
                .sort((a, b) => a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep))[0]
        }

        const structure = creep.room.name == targetFlag.pos.roomName ?
            targetFlag.pos.lookFor(LOOK_STRUCTURES)[0] : undefined

        if (creep.room.name != targetFlag.pos.roomName) {
            creep.moveTo(targetFlag)
            return
        }

        if (enemyTarget != undefined) {
            creep.moveTo(enemyTarget)
        }

        if (enemyTarget == undefined && structure != undefined) {
            creep.moveTo(structure)
        }

        if (enemyTarget == undefined && structure == undefined) {
            creep.moveTo(targetFlag)
        }

        if (enemyTarget != undefined && creep.pos.inRangeTo(enemyTarget, 3)) {
            creep.rangedAttack(enemyTarget)
            creepData.attackEnemy = enemyTarget.id
        }

        if (structure != undefined && creep.pos.inRangeTo(structure, 3)) {
            creep.rangedAttack(structure)
        }
    },
})
