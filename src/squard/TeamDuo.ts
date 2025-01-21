function singleWork(creep: Creep, data: TeamConfig) {
    if (creep == undefined) return
    if (creep.spawning == undefined) return

    const uniqueBodyParts = [...new Set(creep.body.map(part => part.type))];

    if (uniqueBodyParts.includes(HEAL) && data.healTarget != undefined) {
        const healTarget = Game.getObjectById(data.healTarget) as Creep
        if (healTarget != undefined) creep.heal(healTarget)
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

        var healTarget = creep1
        if (creep1 == undefined) healTarget == creep2
        if (creep1 != undefined && creep2 != undefined) {
            healTarget = creep1.hits < creep2.hits ? creep1 : creep2
        }

        singleWork(creep1, data)
        singleWork(creep2, data)

        if ((creep1 != undefined && creep1.fatigue == 0) && (creep2 != undefined && creep2.fatigue == 0)) {
            if (creep1 != undefined) {
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
