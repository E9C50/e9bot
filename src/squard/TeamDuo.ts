function callTower(target: Creep) {
    if (target.my && target.hits < target.hitsMax && Game.time % 10 == 0) {
        target.room.towers.forEach(tower => {
            tower.heal(target)
        })
        return
    }
    if (target.room.towers.filter(tower => tower.store[RESOURCE_ENERGY] > 0).length == target.room.towers.length) {
        target.room.towers.forEach(tower => {
            tower.attack(target)
        })
    }
}

function singleWork(creep: Creep, data: TeamConfig) {
    if (creep == undefined) return
    if (creep.spawning == undefined) return

    const uniqueBodyParts = [...new Set(creep.body.map(part => part.type))];

    if (uniqueBodyParts.includes(HEAL) && !uniqueBodyParts.includes(ATTACK) && data.healTarget != undefined) {
        const healTarget = Game.getObjectById(data.healTarget) as Creep
        if (healTarget != undefined) creep.heal(healTarget)
    }

    let attackTarget: Creep | Structure | undefined = undefined;
    let dismantleTarget: Creep | Structure | undefined = undefined;
    if (data.attackTarget != undefined) {
        attackTarget = Game.getObjectById<Creep>(data.attackTarget) as Creep
    }
    if (data.dismantleTarget != undefined) {
        dismantleTarget = Game.getObjectById<Structure>(data.dismantleTarget) as Structure
    }

    if (attackTarget != undefined) {
        if (uniqueBodyParts.includes(RANGED_ATTACK)) {
            if (creep.pos.isNearTo(attackTarget)) {
                creep.rangedMassAttack()
            } else {
                creep.rangedAttack(attackTarget)
            }
            if (creep.room.my) {
                callTower(attackTarget)
            }
        }
        if (uniqueBodyParts.includes(ATTACK) && creep.pos.inRangeTo(attackTarget, 1)) {
            creep.attack(attackTarget)
            if (creep.room.my) {
                callTower(attackTarget)
            }
        }
    }
    if (dismantleTarget != undefined) {
        if (uniqueBodyParts.includes(WORK)) creep.dismantle(dismantleTarget)
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
        const creep1 = Game.creeps[data.creepNameList[0]]
        const creep2 = Game.creeps[data.creepNameList[1]]
        if (creep1 == undefined && creep2 == undefined) return false

        const needRun = (creep1 != undefined && (creep1.hits < creep1.hitsMax * 0.6)) || (creep2 != undefined && (creep2.hits < creep2.hitsMax * 0.6))

        const rangeEnemies = creep1.room.enemies.filter(enemy => enemy.pos.inRangeTo(creep1, 5))
        let targetPos: RoomPosition = rangeEnemies.length > 0 && !needRun ? rangeEnemies[0].pos : Game.flags[data.teamFlag]?.pos
        if (targetPos == undefined) return false

        data.healTarget = creep1.id
        if (creep1 != undefined && creep2 != undefined) {
            if (creep1.hits < creep2.hits) data.healTarget = creep1.id
            if (creep2.hits < creep1.hits) data.healTarget = creep2.id
        } else if (creep1 != undefined && creep1.hits < creep1.hitsMax) {
            data.healTarget = creep1.id
        } else if (creep2 != undefined && creep2.hits < creep2.hitsMax) {
            data.healTarget = creep2.id
        }

        const closestEnemies3 = creep1.pos.findInRange(FIND_HOSTILE_CREEPS, 3)
        const closestEnemies1 = creep1.pos.findInRange(FIND_HOSTILE_CREEPS, 1)

        if (creep1.room.name == targetPos.roomName) {
            let dismantleTarget = targetPos.lookFor(LOOK_STRUCTURES)
            if (dismantleTarget.length > 0) data.dismantleTarget = dismantleTarget[0].id
        }

        if (closestEnemies3.length > 0) data.attackTarget = closestEnemies3[0].id
        if (closestEnemies1.length > 0) data.attackTarget = closestEnemies1[0].id

        singleWork(creep1, data)
        singleWork(creep2, data)

        if ((creep1 != undefined && creep1.fatigue == 0) && (creep2 != undefined && creep2.fatigue == 0) && !creep1.pos.isEqualTo(targetPos)) {
            if (creep1 != undefined && (creep2 == undefined || creep1.room.name != creep2.room.name || creep1.pos.isNearTo(creep2))) {
                creep1.moveTo(targetPos, { visualizePathStyle: {} })
            }
            if (creep2 != undefined) {
                creep2.moveTo(creep1 || targetPos, { visualizePathStyle: {} })
            }
        }

        return true
    }
})
