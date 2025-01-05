import { defaultReserverSign } from "settings"

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return true
    },
    doWork: (creep: Creep) => {
        const creepData: ReserverData = data as ReserverData

        if (creep.room.name != creepData.targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, creepData.targetRoom))
            return
        }

        if (creep.room.controller == undefined) {
            creep.say('❓')
            return
        }

        if ((creep.room.controller.owner?.username != creep.owner.username
            || creep.room.controller.reservation?.username != creep.owner.username)
            && creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller)
            return
        }

        if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller)
            return
        }

        if (creep.room.controller.sign?.text != defaultReserverSign) {
            creep.signController(creep.room.controller, defaultReserverSign)
        }
    },
})
