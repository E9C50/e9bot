import { getDistance } from "utils"

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return true
    },
    prepare(creep) {
        return true
    },
    source(creep) {
        creep.memory.working = true
        return true
    },
    target(creep) {
        const creepData: ScoutData = data as ScoutData

        for (let i = 0; i < 10; i++) {
            const flag = Game.flags[creep.memory.spawnRoom + '_OUT' + i]
            if (flag != undefined && creep.room.find(FIND_MY_CREEPS).length == 1) {
                if (getDistance(creep.pos, flag.pos) > 3) {
                    creep.moveTo(flag)
                }
                return true
            }
            if (flag != undefined && flag.room?.sources == undefined) {
                if (creep.room.name != flag.pos.roomName || creep.pos.isEqualTo(flag.pos)) {
                    creep.moveTo(flag)
                }
                return true
            }
        }

        const targetFlag = Game.flags[creepData.targetFlag]
        if (targetFlag != undefined && !creep.pos.isEqualTo(targetFlag.pos)) {
            creep.moveTo(targetFlag)
        }

        return true
    },
})
