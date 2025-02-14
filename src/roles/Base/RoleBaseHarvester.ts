export default (role: CreepRoleConstant, data: CreepData): ICreepConfig => ({
    spawnCheck: function (room: Room, creepCount: number): CreepSpawnData | undefined {
        if (creepCount < room.source.length) {
            const workerBodyConfigs = {
                1: { [WORK]: 1, [CARRY]: 1, [MOVE]: 1 },
                2: { [WORK]: 2, [CARRY]: 2, [MOVE]: 2 },
                3: { [WORK]: 3, [CARRY]: 3, [MOVE]: 3 },
                4: { [WORK]: 4, [CARRY]: 4, [MOVE]: 4 },
                5: { [WORK]: 6, [CARRY]: 6, [MOVE]: 6 },
                6: { [WORK]: 7, [CARRY]: 7, [MOVE]: 7 },
                7: { [WORK]: 12, [CARRY]: 6, [MOVE]: 9 },
                8: { [WORK]: 20, [CARRY]: 10, [MOVE]: 20 }
            }
            return { creepRole: role, creepData: {}, bodyPart: workerBodyConfigs[room.level] }
        }
        return undefined
    },
    exec(creep: Creep): void {
        if (!creep.memory.ready && !prepare(creep)) return
        const creepData = creep.memory.data as HarvesterData

        if (creep.memory.working) {
            if (creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.working = false
                return
            }

            if (creepData.targetId == undefined) {
                const links = creep.room.link.filter(link => link.pos.getRangeTo(creep) <= 1)
                const containers = creep.room.container.filter(container => container.pos.getRangeTo(creep) <= 1)
                const constructionSites = creep.room.constructionSite.filter(constructionSite => constructionSite.pos.getRangeTo(creep) <= 1)
                // 没有container，没有link，没有建筑工地的话，就创建建筑工地；有建筑工地就维修
                if (links.length == 0 && containers.length == 0 && constructionSites.length == 0) {
                    creep.pos.createConstructionSite(STRUCTURE_CONTAINER)
                } else if (constructionSites.length > 0) {
                    creep.build(constructionSites[0])
                } else if (links.length > 0) {
                    creepData.targetId = links[0].id
                } else if (containers.length > 0) {
                    creepData.targetId = containers[0].id
                }
            }

            if (creepData.targetId == undefined) return
            const target = Game.getObjectById<AnyStoreStructure>(creepData.targetId)
            if (target != undefined) creep.transfer(target, RESOURCE_ENERGY)
        } else {
            if (creep.store.getFreeCapacity() == 0) {
                creep.memory.working = true
                return
            }
            const targetSource = Game.getObjectById<Source>(creepData.sourceId)
            if (targetSource != undefined) creep.harvest(targetSource)
        }
    }
})

function prepare(creep: Creep): boolean {
    const creepData = creep.memory.data as HarvesterData

    // 绑定目标矿
    if (creepData.sourceId == undefined) {
        const needCreepSource = creep.room.source.filter(source => {
            let sourceCreeps = creep.room.memory.harvestConfig[source.id] || []
            sourceCreeps = sourceCreeps.filter(creepName => Game.creeps[creepName] != undefined)
            creep.room.memory.harvestConfig[source.id] = sourceCreeps
            return sourceCreeps.length == 0
        })

        if (needCreepSource.length > 0) {
            creepData.sourceId = needCreepSource[0].id
            creep.room.memory.harvestConfig[needCreepSource[0].id].push(creep.name)
        }
    }

    // 如果没找到目标，就摆烂
    const targetSource = Game.getObjectById<Source>(creepData.sourceId)
    if (targetSource == undefined) {
        creep.say('❓')
        return false
    }

    // 不在目标矿旁边就过去
    if (!creep.pos.isNearTo(targetSource)) {
        creep.moveTo(targetSource)
        return false
    }

    creep.memory.ready = true
    return true
}
