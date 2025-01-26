import { getClosestTarget } from "utils"

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

        if (!creep.pos.isNearTo(targetFlag)) {
            creep.moveTo(targetFlag)
            return true
        }

        if (creep.room.controller && creep.pos.isNearTo(creep.room.controller)) {
            if (creep.attackController(creep.room.controller) == OK) creep.suicide()
        }

        return true
    },
})
