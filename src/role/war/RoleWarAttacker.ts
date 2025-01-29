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
        const targetFlag: Flag = Game.flags[creepData.targetFlag]
        if (targetFlag == undefined) return false

        if (creep.hits < creep.hitsMax) {
            creep.heal(creep)
        }

        if (creep.room.name != targetFlag.pos.roomName) {
            creep.moveTo(targetFlag)
            return true
        }

        const enemies = creep.room.enemies.filter(enemy => enemy.pos.inRangeTo(creep, 10))
        if (enemies.length > 0) {
            creep.moveTo(enemies[0])
            if (creep.attack(enemies[0]) == OK) {
                callTower(enemies[0])
            }
            return true
        }

        const structure = creep.room.name == targetFlag.pos.roomName ? targetFlag.pos.lookFor(LOOK_STRUCTURES)[0] : undefined
        if (structure != undefined) {
            creep.attack(structure)
            creep.moveTo(structure)
            return true
        }

        creep.moveTo(targetFlag)
        return true
    },
})
