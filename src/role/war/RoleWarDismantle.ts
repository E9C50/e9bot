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
        const targetFlag = Game.flags[creepData.targetFlag]

        if (Game.flags[creep.name] != undefined && !creep.pos.isNearTo(Game.flags[creep.name])) {
            creep.moveTo(Game.flags[creep.name])
            return true
        }

        let targetPos: RoomPosition = targetFlag.pos
        let struList = targetPos.lookFor(LOOK_STRUCTURES)
        if (targetFlag.color != COLOR_RED) {
            struList = struList.filter(stru => stru.structureType == STRUCTURE_WALL || stru.structureType == STRUCTURE_RAMPART)
        }

        let structure = creep.room.name == targetPos.roomName ? struList[0] : undefined
        if (structure == undefined) return true

        if (!creep.pos.isNearTo(structure)) {
            creep.moveTo(structure)
        } else {
            creep.dismantle(structure)
        }
        return true
    },
})
