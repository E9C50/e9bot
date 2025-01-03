// @ts-nocheck

// 初始化内存信息
if (!Memory.stats) Memory.stats = {};
if (!Memory.stats.cpu) Memory.stats.cpu = {};
if (!Memory.stats.gcl) Memory.stats.gcl = {};
if (!Memory.stats.rooms) Memory.stats.rooms = {};

// 在主循环的末尾调用此函数
export const exportStats = function () {
    Memory.stats.time = Game.time;
    Memory.stats.sysTime = new Date().getTime();

    // 收集房间状态
    for (let roomName in Game.rooms) {
        let room = Game.rooms[roomName];
        let isMyRoom = (room.controller ? room.controller.my : false);
        if (isMyRoom) {
            if (!Memory.stats.rooms[roomName]) Memory.stats.rooms[roomName] = {};
            Memory.stats.rooms[roomName].storageEnergy = (room.storage ? room.storage.store.energy : 0);
            Memory.stats.rooms[roomName].terminalEnergy = (room.terminal ? room.terminal.store.energy : 0);
            Memory.stats.rooms[roomName].energyAvailable = room.energyAvailable;
            Memory.stats.rooms[roomName].energyCapacityAvailable = room.energyCapacityAvailable;
            Memory.stats.rooms[roomName].controllerProgress = room.controller.progress;
            Memory.stats.rooms[roomName].controllerProgressTotal = room.controller.progressTotal;
            Memory.stats.rooms[roomName].controllerLevel = room.controller.level;
        }
    }

    // 收集GCL状态
    Memory.stats.gcl.progress = Game.gcl.progress;
    Memory.stats.gcl.progressTotal = Game.gcl.progressTotal;
    Memory.stats.gcl.level = Game.gcl.level;

    // 收集CPU状态
    Memory.stats.cpu.bucket = Game.cpu.bucket;
    Memory.stats.cpu.limit = Game.cpu.limit;
    Memory.stats.cpu.used = Game.cpu.getUsed();
}
