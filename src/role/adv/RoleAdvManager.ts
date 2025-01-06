import { getDistance } from "utils"

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return room.centerLink != undefined && room.storage != undefined
    },
    prepare(creep) {
        if (creep.room.centerLink == undefined || creep.room.storage == undefined) {
            return false
        }

        // 如果不在目标位置则移动
        if (!creep.memory.ready) {
            var managerPos: RoomPosition = creep.room.memory.roomPosition.managerPos as RoomPosition
            if (managerPos != undefined) {
                managerPos = new RoomPosition(managerPos.x, managerPos.y, managerPos.roomName)
                if (!creep.pos.isEqualTo(managerPos)) {
                    creep.moveTo(managerPos)
                    return false
                } else {
                    creep.memory.ready = true
                    return true
                }
            } else {
                if (getDistance(creep.pos, creep.room.storage.pos) > 1) {
                    creep.moveTo(creep.room.storage)
                    return false
                } else if (getDistance(creep.pos, creep.room.centerLink.pos) > 1) {
                    creep.moveTo(creep.room.centerLink)
                    return false
                } else {
                    creep.memory.ready = true
                    return true
                }
            }
        } else {
            return true
        }
    },
    source(creep) {
        creep.memory.working = true
        return true
    },
    target(creep) {
        creep.memory.dontPullMe = true;
        if (creep.room.centerLink == undefined || creep.room.storage == undefined) {
            return false
        }

        // 身上有东西就放到Storage
        if (creep.store.getUsedCapacity() > 0) {
            const resourceType = Object.keys(creep.store)[0] as ResourceConstant
            creep.transfer(creep.room.storage, resourceType);
            return true
        }

        // CenterLink有东西就拿起来
        if (creep.room.centerLink.store[RESOURCE_ENERGY] > 0) {
            creep.withdraw(creep.room.centerLink, RESOURCE_ENERGY);
            return true
        }

        // 终端有东西就拿起来
        if (creep.room.terminal != undefined && creep.room.terminal.store.getUsedCapacity() > 0) {
            const resourceType = Object.keys(creep.room.terminal.store)[0] as ResourceConstant
            creep.withdraw(creep.room.terminal, resourceType);
            return true
        }

        return true
    },
})
