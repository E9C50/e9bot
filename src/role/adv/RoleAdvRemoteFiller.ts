import { getClosestTarget, getDistance } from "utils"

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return true
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

        const creepData: RemoteFillerData = data as RemoteFillerData
        // 如果不在目标房间，则去往目标房间
        if (creep.room.name != creepData.targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, creepData.targetRoom))
            return true
        }

        var withdrawTarget: Structure | undefined = undefined
        var withdrawResource: ResourceConstant | undefined = undefined

        if (creep.pickupDroppedResource(true, 10)) return true

        // 如果是外矿专属搬运，就去矿点
        if (creepData.sourceId != undefined) {
            const sourceTarget = Game.getObjectById(creepData.sourceId) as Source
            if (getDistance(creep.pos, sourceTarget.pos) > 3) {
                creep.moveTo(sourceTarget)
                return true
            }
        }

        // 如果有缓存建筑，就去拿缓存
        if (creepData.withdrawTarget != undefined) {
            withdrawTarget = Game.getObjectById(creepData.withdrawTarget) as Structure
            withdrawResource = Object.keys(withdrawTarget['store'])[0] as ResourceConstant
        }

        // 如果外矿专属搬运，且没有缓存目标，就添加缓存
        if (creepData.sourceId != undefined && creepData.withdrawTarget == undefined) {
            withdrawTarget = getClosestTarget(creep.pos, creep.room.containers)
            withdrawResource = Object.keys(withdrawTarget['store'])[0] as ResourceConstant
        }

        // 如果有Storage并且有资源就去捡
        if (creepData.sourceId == undefined && withdrawTarget == undefined && creep.room.storage != undefined && creep.room.storage.store.getUsedCapacity() > 0) {
            const firstResourceType = Object.keys(creep.room.storage.store)[0] as ResourceConstant
            withdrawTarget = creep.room.storage
            withdrawResource = firstResourceType
        }

        // 如果有Spawns并且有资源就去捡
        if (creepData.sourceId == undefined && withdrawTarget == undefined) {
            const spawns = creep.room.spawns.filter(spawn => spawn.store[RESOURCE_ENERGY] > 0)
            if (spawns.length > 0) {
                withdrawTarget = getClosestTarget(creep.pos, spawns)
                withdrawResource = RESOURCE_ENERGY
            }
        }

        // 如果有Extensions并且有资源就去捡
        if (creepData.sourceId == undefined && withdrawTarget == undefined) {
            const extensions = creep.room.extensions.filter(extension => extension.store[RESOURCE_ENERGY] > 0)
            if (extensions.length > 0) {
                withdrawTarget = getClosestTarget(creep.pos, extensions)
                withdrawResource = RESOURCE_ENERGY
            }
        }

        // 如果有Containers并且有资源就去捡
        if (withdrawTarget == undefined) {
            const containers = creep.room.containers.filter(container => container.store[RESOURCE_ENERGY] > 0)
            if (containers.length > 0) {
                withdrawTarget = getClosestTarget(creep.pos, containers)
                withdrawResource = RESOURCE_ENERGY
            }
        }

        if (withdrawTarget != undefined && withdrawResource != undefined) {
            if (getDistance(creep.pos, withdrawTarget.pos) > 1) {
                creep.moveTo(withdrawTarget)
                creepData.withdrawTarget = withdrawTarget.id
            } else {
                creep.withdraw(withdrawTarget, withdrawResource)
                if (creepData.sourceId == undefined) {
                    creepData.withdrawTarget = undefined
                }
            }
            return true
        }

        // 啥都没有就去source待命
        if (creepData.sourceId != undefined) {
            const sourceTarget = Game.getObjectById(creepData.sourceId) as Source
            if (getDistance(creep.pos, sourceTarget.pos) > 3) {
                console.log('啥都没有就去source待命')
                creep.moveTo(sourceTarget)
            }
        }

        return true
    },
    target(creep) {
        // 如果没有资源了，就切换为采集状态
        if (creep.store.getUsedCapacity() == 0) {
            creep.memory.working = false
            return false
        }

        // 如果不在出生房，则去往出生房
        if (creep.room.name != creep.memory.spawnRoom) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.spawnRoom))
            return true
        }

        // 如果身上不止有能量，则搬运到Storage
        if (creep.room.storage != undefined && Object.keys(creep.store).filter(key => key != RESOURCE_ENERGY).length > 0) {
            if (getDistance(creep.pos, creep.room.storage.pos) > 1) {
                creep.moveTo(creep.room.storage)
                return true
            }
            creep.transfer(creep.room.storage, creep.store[0])
            return true
        }

        // 搬运到最近的storage、link、container
        const structureList: Structure[] = [creep.room.storage, ...creep.room.links, ...creep.room.containers]
            .filter(item => item != undefined && item.store.getFreeCapacity(RESOURCE_ENERGY) > 0) as Structure[]
        const structure = getClosestTarget(creep.pos, structureList)
        if (getDistance(creep.pos, structure.pos) > 1) {
            creep.moveTo(structure)
            return true
        }
        creep.transfer(structure, RESOURCE_ENERGY)
        return true
    },
})
