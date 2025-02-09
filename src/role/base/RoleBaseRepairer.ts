import { getDistance } from "utils"
import BaseRoleUpgrader from "./RoleBaseUpgrader"

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return room.storage != undefined && room.storage.store[RESOURCE_ENERGY] > 10000 && room.wallsNeedRepair.length > 0
    },
    prepare(creep) {
        if (creep.room.level == 8) {
            return creep.goBoost()
        }
        return true
    },
    source(creep) {
        // 如果没有空余容量了，就开始工作
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true
            return false
        }

        const creepData: RepairerData = data as RepairerData
        const sourceTarget: StructureContainer | StructureStorage = Game.getObjectById(creepData.sourceId) as StructureContainer | StructureStorage

        if (sourceTarget == undefined || sourceTarget.store[RESOURCE_ENERGY] == 0) {
            creep.say("💤")
            return true
        }

        if (getDistance(creep.pos, sourceTarget.pos) <= 1) {
            creep.withdraw(sourceTarget, RESOURCE_ENERGY)
        } else {
            creep.moveTo(sourceTarget)
        }

        return true
    },
    target(creep) {
        const creepData: RepairerData = data as RepairerData

        // 如果没有能量了，就切换为采集状态
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false
            creepData.repairTarget = ''
            return false
        }

        // 找到要修复的建筑
        var repairTarget = Game.getObjectById<Structure>(creepData.repairTarget || '');
        if (repairTarget == undefined || repairTarget.hits == repairTarget.hitsMax) {
            let repairTargets = creep.room.wallsNeedRepair
            if (Memory.warMode[creep.room.name]) {
                const defenderCostMatrix = creep.room.getDefenderCostMatrix()
                repairTargets = repairTargets.filter(target => defenderCostMatrix.get(target.pos.x, target.pos.y) != 255)
            }
            repairTargets = repairTargets.sort((a, b) => a.hits - b.hits)
            if (repairTargets.length > 0) creepData.repairTarget = repairTargets[0].id
        }

        // 如果没有就去升级
        if (repairTarget == undefined) {
            return BaseRoleUpgrader(creep.memory.data).target(creep)
        }

        // 过去维修
        if (getDistance(creep.pos, repairTarget.pos) <= 3) {
            creep.repair(repairTarget)
        } else {
            creep.moveTo(repairTarget)
        }

        return true
    },
})
