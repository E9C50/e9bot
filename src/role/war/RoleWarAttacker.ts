function callTower(target: Creep) {
    if (target.room.towers.filter(tower => tower.store[RESOURCE_ENERGY] > 0).length == target.room.towers.length) {
        target.room.towers.forEach(tower => {
            tower.attack(target)
        })
    }
}

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        const creepData: AttackerData = data as AttackerData
        return Game.flags[creepData.targetFlag] != undefined
    },
    prepare(creep) {
        return creep.goBoost()
    },
    source(creep) {
        creep.memory.working = true
        return true
    },
    target(creep) {
        const creepData: AttackerData = data as AttackerData

        const enemies = creep.room.enemies.filter(enemy => enemy.owner.username == 'Avarice' && enemy.pos.inRangeTo(creep, 20))
        let targetPos: RoomPosition = Game.flags[creepData.targetFlag]?.pos || enemies[0]?.pos
        if (targetPos == undefined) return true

        if (creep.room.name != targetPos.roomName) {
            creep.moveTo(targetPos)
        }

        if (enemies.length > 0) {
            creep.moveTo(enemies[0])
            if (creep.attack(enemies[0]) == OK) {
                callTower(enemies[0])
            } else {
                creep.heal(creep)
            }
            return true
        }

        const structure = creep.room.name == targetPos.roomName ? targetPos.lookFor(LOOK_STRUCTURES)[0] : undefined
        if (structure != undefined) {
            creep.attack(structure)
            creep.moveTo(structure)
            return true
        }

        creep.moveTo(targetPos)
        if (creep.hits < creep.hitsMax) creep.heal(creep)
        return true
    },
})
