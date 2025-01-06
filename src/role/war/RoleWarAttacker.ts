export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        const creepData: AttackerData = data as AttackerData
        return Game.flags[creepData.targetFlag] != undefined
    },
    prepare(creep) {
        const creepData: AttackerData = data as AttackerData
        if (creepData.needBoost) {
            // 处理boost
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
        const creepData: AttackerData = data as AttackerData
        const targetFlag: Flag = Game.flags[creepData.targetFlag]
        if (targetFlag == undefined) return false

        const enemies = creep.room.enemies.filter(enemy => !enemy.my && enemy.pos.inRangeTo(creep, 3))
            .sort((a, b) => a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep))
        const structure = creep.room.name == targetFlag.pos.roomName ? targetFlag.pos.lookFor(LOOK_STRUCTURES)[0] : undefined

        if (creep.room.name != targetFlag.pos.roomName) {
            creep.moveTo(targetFlag)
        } else if (structure != undefined) {
            creep.moveTo(structure)
        } else if (enemies.length > 0) {
            creep.moveTo(enemies[0])
        } else {
            creep.moveTo(targetFlag)
        }

        if (creep.pos.isNearTo(enemies[0])) {
            creep.attack(enemies[0])
        } else if (structure != undefined && creep.pos.isNearTo(structure)) {
            creep.attack(structure)
        }
        return true
    },
})
