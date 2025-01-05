export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return true
    },
    doWork: (creep: Creep) => {
        const creepData: RemoteFillerData = data as RemoteFillerData

        // 如果没有携带东西，且不在目标房间，则去往目标房间
        if (creep.store.getUsedCapacity() == 0 && creep.room.name != creepData.targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, creepData.targetRoom))
            return
        }

        // 如果身上没有多余空间，且不在出生房，则去往出生房
        if (creep.store.getFreeCapacity() == 0 && creep.room.name != creep.memory.spawnRoom) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.spawnRoom))
            return
        }

        // 如果身上没有多余空间，且在出生房，则寻找最近的link或者storage
        if (creep.store.getUsedCapacity() > 0 && creep.room.name == creep.memory.spawnRoom) {
            if (creep.room.storage && Object.keys(creep.store).filter(key => key != RESOURCE_ENERGY).length > 0) {
                if (creep.transfer(creep.room.storage, creep.store[0])) {
                    creep.moveTo(creep.room.storage)
                }
                return
            }

            if (creep.store[RESOURCE_ENERGY] == creep.store.getUsedCapacity()) {
                const structure = ([creep.room.storage, ...creep.room.links, ...creep.room.containers]
                    .filter(item => item != undefined) as Structure[])
                    .sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b))[0]

                if (creep.transfer(structure, RESOURCE_ENERGY)) {
                    creep.moveTo(structure)
                }
                return
            }
        }

        // 如果有空间，且在目标房间，则取捡起资源
        if (creep.store.getFreeCapacity() > 0 && creep.room.name == creepData.targetRoom) {
            // 如果有Storage并且有资源就去捡
            if (creep.room.storage != undefined && creep.room.storage.store.getUsedCapacity() > 0) {
                const firstResourceType = Object.keys(creep.room.storage.store)[0] as ResourceConstant
                if (creep.withdraw(creep.room.storage, firstResourceType) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage)
                }
                return
            }

            // 如果有Spawns并且有资源就去捡
            const spawns = creep.room.spawns.filter(spawn => spawn.store[RESOURCE_ENERGY] > 0)
            if (spawns.length > 0) {
                const withdrawTarget = spawns.sort((a, b) => a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep))[0]
                if (creep.withdraw(withdrawTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(withdrawTarget)
                }
                return
            }

            // 如果有Extensions并且有资源就去捡
            const extensions = creep.room.extensions.filter(spawn => spawn.store[RESOURCE_ENERGY] > 0)
            if (extensions.length > 0) {
                const withdrawTarget = extensions.sort((a, b) => a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep))[0]
                if (creep.withdraw(withdrawTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(withdrawTarget)
                }
                return
            }

            // 如果有Containers并且有资源就去捡
            const containers = creep.room.containers.filter(spawn => spawn.store[RESOURCE_ENERGY] > 0)
            if (containers.length > 0) {
                const withdrawTarget = containers.sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY])[0]
                if (creep.withdraw(withdrawTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(withdrawTarget)
                }
                return
            }

            if (creep.pos.isNearTo(creep.room.sources[0])) {
                creep.moveTo(creep.room.sources[0])
            }
        }
    },
})
