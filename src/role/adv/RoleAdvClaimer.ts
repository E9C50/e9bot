import { defaultConrtollerSign } from "settings"
import RoleBaseBuilder from '../base/RoleBaseBuilder'
import { getDistance } from "utils"
import RoleBaseFiller from "role/base/RoleBaseFiller"
import RoleBaseHarvester from "role/base/RoleBaseHarvester"

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
        // 如果没有空余容量了，就开始工作
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true
            return false
        }

        const creepData: ClaimerData = data as ClaimerData
        const sourceList = creep.room.sources.filter(source => source.energy > 0)
        if (sourceList.length == 0) return false

        creepData.sourceId = sourceList[0].id
        const sourceTarget = Game.getObjectById(creepData.sourceId) as Source
        if (getDistance(creep.pos, sourceTarget.pos) > 1) {
            creep.moveTo(sourceTarget)
            return true
        }

        RoleBaseHarvester(creep.memory.data).source(creep)
        return true
    },
    target(creep) {
        // 如果没有能量了，就切换为采集状态
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false
            return false
        }

        // 有工地就建造
        if (creep.room.constructionSites.length > 0) {
            RoleBaseBuilder(creep.memory.data).target(creep)
            return true
        }

        // 没工地就填充
        RoleBaseFiller(creep.memory.data).target(creep)
        return true
    },
})
