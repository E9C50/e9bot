import { getClosestTarget } from "utils"

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

        let targetPos: RoomPosition = Game.flags[creepData.targetFlag]?.pos
        if (targetPos == undefined) {
            const dismStrus: Structure[] = [...creep.room.spawns, ...creep.room.extensions, ...creep.room.towers, ...creep.room.labs]
            if (creep.room.storage != undefined) dismStrus.push(creep.room.storage)
            targetPos = getClosestTarget(creep.pos, dismStrus).pos
        }

        if (Game.flags[creep.name] != undefined && !creep.pos.isEqualTo(Game.flags[creep.name])) {
            creep.moveTo(Game.flags[creep.name])
            return true
        } else if (!creep.pos.isNearTo(targetPos)) {
            creep.moveTo(targetPos)
            return true
        }

        const struList = targetPos.lookFor(LOOK_STRUCTURES).filter(stru => stru.structureType != STRUCTURE_TERMINAL)
        let structure = creep.room.name == targetPos.roomName ? struList[0] : undefined

        if (structure == undefined) {
            const dismStrus: Structure[] = [...creep.room.spawns, ...creep.room.extensions, ...creep.room.towers, ...creep.room.labs]
            if (creep.room.storage != undefined) dismStrus.push(creep.room.storage)
            structure = getClosestTarget(creep.pos, dismStrus)
        }

        if (!creep.pos.isNearTo(structure)) {
            creep.moveTo(structure)
        }

        if (structure != undefined && structure.structureType != STRUCTURE_TERMINAL) {
            creep.dismantle(structure)
            return true
        }

        return true
    },
})
