export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return room.centerLink != undefined && room.storage != undefined
    },
    doWork: (creep: Creep) => {
        if (creep.room.centerLink == undefined || creep.room.storage == undefined) {
            return
        }
        creep.memory.dontPullMe = true;

        // 如果不在目标位置则移动
        if (!creep.memory.ready) {
            var managerPos: RoomPosition = creep.room.memory.roomPosition.managerPos as RoomPosition
            if (managerPos != undefined) {
                managerPos = new RoomPosition(managerPos.x, managerPos.y, managerPos.roomName)
                if (!creep.pos.isEqualTo(managerPos)) {
                    creep.moveTo(managerPos)
                    return
                } else {
                    creep.memory.ready = true
                }
            } else {
                if (!creep.pos.isNearTo(creep.room.storage)) {
                    creep.moveTo(creep.room.storage)
                    return
                } else if (!creep.pos.isNearTo(creep.room.centerLink)) {
                    creep.moveTo(creep.room.centerLink)
                    return
                } else {
                    creep.memory.ready = true
                }
            }
        }

        // 把终端的资源搬回仓库
        if (creep.room.terminal && creep.room.terminal.store.getUsedCapacity() > 0) {
            const resourceType = Object.keys(creep.room.terminal.store)[0] as ResourceConstant
            if (creep.store[resourceType] > 0) {
                creep.transfer(creep.room.storage, resourceType);
            } else {
                creep.withdraw(creep.room.terminal, resourceType);
            }
        }

        // 能量搬运任务
        if (creep.room.memory.centerLinkSentMode) {
            if (creep.store[RESOURCE_ENERGY] > 0) {
                creep.transfer(creep.room.centerLink, RESOURCE_ENERGY);
            } else {
                creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
            }
        } else {
            if (creep.store[RESOURCE_ENERGY] > 0) {
                creep.transfer(creep.room.storage, RESOURCE_ENERGY);
            } else {
                creep.withdraw(creep.room.centerLink, RESOURCE_ENERGY);
            }
        }
    },
})
