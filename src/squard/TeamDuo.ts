function singleWork(creep: Creep, data: TeamConfig) {
    if (creep == undefined) return
    if (creep.spawning == undefined) return

    const uniqueBodyParts = [...new Set(creep.body.map(part => part.type))];

    if (uniqueBodyParts.includes(HEAL) && data.healTarget != undefined) {
        const healTarget = Game.getObjectById(data.healTarget) as Creep
        if (healTarget != undefined) creep.heal(healTarget)
    }

    if (data.attackTarget != undefined) {
        const enemy = Game.getObjectById<Creep>(data.attackTarget)
        if (uniqueBodyParts.includes(RANGED_ATTACK) && enemy) creep.rangedAttack(enemy)
    } else if (data.dismantleTarget != undefined) {
        const target = Game.getObjectById<Structure>(data.dismantleTarget)
        if (uniqueBodyParts.includes(RANGED_ATTACK) && target) creep.rangedAttack(target)
    }
}

export default (data: TeamConfig): ITeamConfig => ({
    prepare: function (): boolean {
        const targetFlag = Game.flags[data.teamFlag]
        if (targetFlag == undefined) return false

        var allBoosted = false
        const creep1 = Game.creeps[data.creepNameList[0]]
        const creep2 = Game.creeps[data.creepNameList[1]]
        if (creep1 != undefined) allBoosted = creep1.goBoost()
        if (creep2 != undefined) allBoosted = allBoosted && creep2.goBoost()

        return allBoosted
    },
    doWork: function (): boolean {
        const targetFlag = Game.flags[data.teamFlag]
        if (targetFlag == undefined) return false

        const creep1 = Game.creeps[data.creepNameList[0]]
        const creep2 = Game.creeps[data.creepNameList[1]]
        if (creep1 == undefined && creep2 == undefined) return false

        data.healTarget = undefined
        if (creep1 != undefined && creep2 != undefined) {
            if (creep1.hits < creep2.hits) data.healTarget = creep1.id
            if (creep2.hits < creep1.hits) data.healTarget = creep2.id
        } else if (creep1 != undefined && creep1.hits < creep1.hitsMax) {
            data.healTarget = creep1.id
        } else if (creep2 != undefined && creep2.hits < creep2.hitsMax) {
            data.healTarget = creep2.id
        }

        let dismantleTarget = creep1.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3)
        dismantleTarget = dismantleTarget.sort((a, b) => a.hits - b.hits)

        const closestEnemies3 = creep1.pos.findInRange(FIND_HOSTILE_CREEPS, 3)
        const closestEnemies1 = creep1.pos.findInRange(FIND_HOSTILE_CREEPS, 1)

        if (dismantleTarget.length > 0) data.dismantleTarget = dismantleTarget[0].id

        if (closestEnemies3.length > 0) data.attackTarget = closestEnemies3[0].id
        if (closestEnemies1.length > 0) data.attackTarget = closestEnemies1[0].id

        singleWork(creep1, data)
        singleWork(creep2, data)

        if ((creep1 != undefined && creep1.fatigue == 0) && (creep2 != undefined && creep2.fatigue == 0)) {
            if (creep1 != undefined && (creep2 == undefined || creep1.room.name != creep2.room.name || creep1.pos.isNearTo(creep2))) {
                creep1.moveTo(targetFlag)
                creep1.memory.dontPullMe = true
            }
            if (creep2 != undefined) {
                creep2.moveTo(creep1 || targetFlag)
                creep2.memory.dontPullMe = true
            }
        }

        return true
    }
})
