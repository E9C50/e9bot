import { getDistance } from "utils"
import { defaultConrtollerSign } from "settings"
import RoleAdvRemoteBuilder from "./RoleAdvRemoteBuilder"

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return true
    },
    prepare(creep) {
        const creepData: ClaimerData = data as ClaimerData

        // 不在目标房间就过去
        if (creep.room.name != creepData.targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, creepData.targetRoom))
            return false
        }

        // 没找到控制器就摆烂
        if (creep.room.controller == undefined) {
            creep.say('❓')
            return false
        }

        // 如果房间已经是我的了，那就开始工作
        if (creep.room.controller.my) {
            return true
        }

        // 不在控制器旁边就过去
        if (getDistance(creep.pos, creep.room.controller.pos) > 1) {
            creep.moveTo(creep.room.controller)
            return false
        }

        const owner = creep.room.controller.owner
        const reservation = creep.room.controller.reservation

        // 已经有人控制或者预定，就干他
        if ((owner != undefined && owner.username != creep.owner.username) || (reservation != undefined && reservation.username != creep.owner.username)) {
            creep.attackController(creep.room.controller)
            return false
        }

        // 签名不一致就签名
        if (creep.room.controller.sign?.text != defaultConrtollerSign) {
            creep.signController(creep.room.controller, defaultConrtollerSign)
            return false
        }

        // 占领
        creep.claimController(creep.room.controller)
        return true
    },
    source(creep) {
        return RoleAdvRemoteBuilder(creep.memory.data).source(creep)
    },
    target(creep) {
        return RoleAdvRemoteBuilder(creep.memory.data).target(creep)
    },
})
