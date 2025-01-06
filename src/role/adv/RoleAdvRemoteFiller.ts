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

        // 如果有Storage并且有资源就去捡
        if (creep.room.storage != undefined && creep.room.storage.store.getUsedCapacity() > 0) {
            const firstResourceType = Object.keys(creep.room.storage.store)[0] as ResourceConstant
            if (getDistance(creep.pos, creep.room.storage.pos) > 1) {
                creep.moveTo(creep.room.storage)
            } else {
                creep.withdraw(creep.room.storage, RESOURCE_ENERGY)
            }
            return true
        }

        // 如果有Spawns并且有资源就去捡
        const spawns = creep.room.spawns.filter(spawn => spawn.store[RESOURCE_ENERGY] > 0)
        if (spawns.length > 0) {
            const withdrawTarget = getClosestTarget(creep.pos, spawns)
            if (getDistance(creep.pos, withdrawTarget.pos) > 1) {
                creep.moveTo(withdrawTarget)
            } else {
                creep.withdraw(withdrawTarget, RESOURCE_ENERGY)
            }
            return true
        }

        // 如果有Extensions并且有资源就去捡
        const extensions = creep.room.extensions.filter(extension => extension.store[RESOURCE_ENERGY] > 0)
        if (extensions.length > 0) {
            const withdrawTarget = getClosestTarget(creep.pos, extensions)
            if (getDistance(creep.pos, withdrawTarget.pos) > 1) {
                creep.moveTo(withdrawTarget)
            } else {
                creep.withdraw(withdrawTarget, RESOURCE_ENERGY)
            }
            return true
        }

        // 如果有Containers并且有资源就去捡
        const containers = creep.room.containers.filter(container => container.store[RESOURCE_ENERGY] > 0)
        if (containers.length > 0) {
            const withdrawTarget = containers.sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY])[0]
            if (getDistance(creep.pos, withdrawTarget.pos) > 1) {
                creep.moveTo(withdrawTarget)
            } else {
                creep.withdraw(withdrawTarget, RESOURCE_ENERGY)
            }
            return true
        }

        // 啥都没有就去source待命
        if (getDistance(creep.pos, creep.room.sources[0].pos) > 3) {
            creep.moveTo(creep.room.sources[0])
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
        const structureList: Structure[] = [...[creep.room.storage], ...creep.room.links, ...creep.room.containers].filter(item => item != undefined) as Structure[]
        const structure = getClosestTarget(creep.pos, structureList)
        if (getDistance(creep.pos, structure.pos) > 1) {
            creep.moveTo(structure)
            return true
        }
        creep.transfer(structure, RESOURCE_ENERGY)
        return true
    },
})
