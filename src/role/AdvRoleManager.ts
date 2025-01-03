export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return room.centerLink != undefined && room.storage != undefined
    },
    doWork: (creep: Creep) => {
        if (creep.room.centerLink == undefined || creep.room.storage == undefined) {
            creep.say('❓')
            return
        }

        // 如果不在目标位置则移动
        var managerPos: RoomPosition = creep.room.memory.managerPos as RoomPosition
        if (managerPos != undefined) {
            managerPos = new RoomPosition(managerPos.x, managerPos.y, managerPos.roomName)
            if (!creep.pos.isEqualTo(managerPos)) {
                creep.moveTo(managerPos)
                return
            }
        } else {
            if (!creep.pos.isNearTo(creep.room.storage)) {
                creep.moveTo(creep.room.storage)
                return
            }
            if (!creep.pos.isNearTo(creep.room.centerLink)) {
                creep.moveTo(creep.room.centerLink)
                return
            }
        }

        creep.memory.dontPullMe = true;

        // 终端填充任务
        // if (!Memory.jobs.fillTerminal) Memory.jobs.fillTerminal = {};
        // if (!Memory.jobs.fillTerminal[creep.room.name]) Memory.jobs.fillTerminal[creep.room.name] = [];
        // if (Memory.jobs.fillTerminal[creep.room.name].length > 0) {
        //     const fillTerminalJob = Memory.jobs.fillTerminal[creep.room.name][0];
        //     const resourceType = fillTerminalJob.type;
        //     const carryAmount = creep.store[resourceType];

        //     if (carryAmount == 0) {
        //         if (resourceType == RESOURCE_ENERGY && centerLink.store[RESOURCE_ENERGY] > 0) {
        //             creep.withdraw(centerLink, resourceType);
        //         } else {
        //             creep.withdraw(storage, resourceType);
        //         }
        //     } else {
        //         creep.transfer(terminal, resourceType, carryAmount)
        //         Memory.jobs.fillTerminal[creep.room.name][0].amount -= carryAmount

        //         if (Memory.jobs.fillTerminal[creep.room.name][0].amount <= 0) {
        //             Memory.jobs.fillTerminal[creep.room.name].shift()
        //         }
        //     }
        //     if (centerLink.store[RESOURCE_ENERGY] == 0) return;
        // }

        // 终端提取任务
        // if (!Memory.jobs.takeTerminal) Memory.jobs.takeTerminal = {};
        // if (!Memory.jobs.takeTerminal[creep.room.name]) Memory.jobs.takeTerminal[creep.room.name] = [];
        // if (Memory.jobs.takeTerminal[creep.room.name].length > 0) {
        //     const takeTerminalJob = Memory.jobs.takeTerminal[creep.room.name][0];
        //     const resourceType = takeTerminalJob.type;
        //     const carryAmount = creep.store[resourceType];

        //     if (carryAmount == 0) {
        //         const takeAmount = Math.min(Memory.jobs.takeTerminal[creep.room.name][0].amount, creep.store.getFreeCapacity())
        //         creep.withdraw(terminal, resourceType, takeAmount);
        //     } else {
        //         creep.transfer(storage, resourceType, carryAmount)
        //         Memory.jobs.takeTerminal[creep.room.name][0].amount -= carryAmount

        //         if (Memory.jobs.takeTerminal[creep.room.name][0].amount <= 0) {
        //             Memory.jobs.takeTerminal[creep.room.name].shift()
        //         }
        //     }
        //     if (centerLink.store[RESOURCE_ENERGY] == 0) return;
        // }

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
