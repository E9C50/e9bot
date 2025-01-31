export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        const creepData: AttackerData = data as AttackerData
        return Game.flags[creepData.targetFlag] != undefined
    },
    prepare(creep) {
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

        if (Game.flags[creep.name] != undefined && !creep.pos.isEqualTo(Game.flags[creep.name])) {
            creep.moveTo(Game.flags[creep.name])
            return true
        } else if (!creep.pos.isNearTo(targetFlag)) {
            creep.moveTo(targetFlag)
            return true
        }

        if (creep.room.controller) {
            if ((creep.room.controller.upgradeBlocked == undefined || creep.room.controller.upgradeBlocked <= 1) && creep.attackController(creep.room.controller) == OK) {
                targetFlag.remove()
                creep.suicide()
            }
            if (creep.room.controller.upgradeBlocked > 700) {
                targetFlag.remove()
                creep.suicide()
            }
        }

        return true
    },
})
