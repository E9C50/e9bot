import { getClosestTarget, getDistance } from 'utils'
import RoleBaseRepairer from './RoleBaseRepairer'
import RoleBaseUpgrader from './RoleBaseUpgrader'

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return room.constructionSites.length > 0
    },
    prepare(creep) {
        return true
    },
    source(creep) {
        // 如果没有空余容量了，就开始工作
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true
            return false
        }

        const creepData: BuilderData = data as BuilderData
        var sourceTarget: StructureContainer | StructureStorage = Game.getObjectById(creepData.sourceId) as StructureContainer | StructureStorage

        if (sourceTarget == undefined) {
            sourceTarget = creep.room.containers.filter(item => item != undefined)[0]
            if (sourceTarget == undefined) {
                creep.say('❓')
                return false
            }
            creepData.sourceId = sourceTarget.id
        }

        if (sourceTarget != undefined && sourceTarget.store[RESOURCE_ENERGY] == 0) {
            if (creep.pickupDroppedResource(false, 20)) return true
        }

        if (sourceTarget.store[RESOURCE_ENERGY] == 0) {
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
        // 如果没有能量了，就切换为采集状态
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false
            return false
        }

        const creepData: BuilderData = data as BuilderData

        // 如果有正在修建的建筑，但是现在找不到了，说明修好了，然后更新缓存
        if (creepData.buildTarget != undefined) {
            if (Game.getObjectById(creepData.buildTarget) == undefined) {
                creep.room.memory.needUpdateCache = true
                creepData.buildTarget = undefined
            }
        }

        // 如果附近有生命值低于5000的Rampart，就优先修理
        const repairTargets: Structure[] = creep.room.ramparts.filter(
            rampart => rampart.hits < 5000 && getDistance(rampart.pos, creep.pos) < 5
        )
        if (repairTargets.length > 0) {
            creep.repair(repairTargets[0])
            return true
        }

        const buildTargets: ConstructionSite[] = creep.room.constructionSites

        // 如果没有建筑工地并且需要升级，就去升级
        if (buildTargets.length == 0 && creep.room.level < 8) {
            return RoleBaseUpgrader(creep.memory.data).target(creep)
        }

        // 如果没有建筑工地也不需要升级，就去干修理的活
        if (buildTargets.length == 0) {
            return RoleBaseRepairer(creep.memory.data).target(creep)
        }

        // 寻找最近的工地去修理，并且缓存
        const buildTarget = getClosestTarget(creep.pos, buildTargets)
        creepData.buildTarget = buildTarget.id
        if (creep.memory.working && creep.build(buildTarget) == ERR_NOT_IN_RANGE) {
            creep.moveTo(buildTarget);
        }
        return true
    },
})
