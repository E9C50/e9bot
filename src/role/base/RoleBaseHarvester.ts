import { getClosestTarget, getDistance } from "utils"

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return true
    },
    prepare(creep) {
        const creepData: HarvesterData = data as HarvesterData
        const sourceTarget: Source = Game.getObjectById<Source>(creepData.sourceId) as Source

        // 如果不在目标位置则移动
        if (!creep.memory.ready) {
            if (!creep.pos.isNearTo(sourceTarget)) {
                creep.moveTo(sourceTarget)
                return false
            } else {
                creep.memory.ready = true
                return true
            }
        } else {
            return true
        }
    },
    source(creep) {
        // 如果没有空余容量了，就开始工作
        if (creep.store.getFreeCapacity() <= 20) {
            creep.memory.working = true
            return false
        }

        const creepData: HarvesterData = data as HarvesterData
        const sourceTarget: Source = Game.getObjectById<Source>(creepData.sourceId) as Source
        if (creep.harvest(sourceTarget) == ERR_NOT_IN_RANGE) creep.memory.ready = false
        return true
    },
    target(creep) {
        // 如果没有能量了，就切换为采集状态
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false
            return false
        }

        const creepData: HarvesterData = data as HarvesterData

        // 如果有正在修建的建筑，但是现在找不到了，说明修好了，然后更新缓存
        if (creepData.buildTarget != undefined) {
            if (Game.getObjectById(creepData.buildTarget) == undefined) {
                creep.room.memory.needUpdateCache = true
                creepData.buildTarget = undefined
            }
        }

        // 如果有link则存放
        const link = creep.room.links.filter(item => creep.pos.isNearTo(item))[0]
        if (link != undefined && link.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            creep.transfer(link, RESOURCE_ENERGY)
            return true
        }

        // 如果有container，如果生命值不够，则维修，要么就存放
        const container = creep.room.containers.filter(item => creep.pos.isNearTo(item))
            .sort((a, b) => a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY])[0]
        if (container != undefined && container.hits < container.hitsMax) {
            creep.repair(container)
            return true
        }
        if (container != undefined && container.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            creep.transfer(container, RESOURCE_ENERGY)
            return true
        }

        // 如果有工地则建造
        const constructionSite = getClosestTarget(creep.pos, creep.room.constructionSites)
        if (constructionSite != undefined) {
            creepData.buildTarget = constructionSite.id
            creep.build(constructionSite)
            return true
        }

        // 没有Container也没有工地，那就创建
        if (constructionSite == undefined && container == undefined && link == undefined) {
            creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_CONTAINER)
        }
        return true
    },
})
