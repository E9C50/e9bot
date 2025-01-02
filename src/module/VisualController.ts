function showCreepCountInfo(room: Room): void {
    const initDict = {
        'harvester': 0, 'filler': 0, 'manager': 0, 'builder': 0, 'repairer': 0, 'upgrader': 0,
        'miner': 0, 'reserver': 0, 'rHarvester': 0, 'rFiller': 0
    };

    //  统计当前数量
    let roleCounts = { ...initDict };
    for (let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];
        let role = creep.memory.role;
        let creepRoom = creep.memory.spawnRoom;

        if (role && creepRoom == room.name) {
            if (!roleCounts[role]) {
                roleCounts[role] = 0;
            }
            roleCounts[role]++;
        }
    }

    //  统计最大数量
    let roleMaxCounts = { ...initDict };
    for (let creepName in room.memory.creepConfig) {
        let creep = room.memory.creepConfig[creepName];
        let role = creep.role;

        if (role) {
            if (!roleMaxCounts[role]) {
                roleMaxCounts[role] = 0;
            }
            roleMaxCounts[role]++;
        }
    }

    // 去除一些不需要统计的角色
    // delete roleCounts['claimer'];
    // delete roleCounts['dismantler'];

    // 显示统计信息
    const infoPos = room.memory.infoPos || (room.controller && room.controller.pos);
    if (infoPos) {
        var index = infoPos.y - 4;
        for (let role in roleCounts) {
            const checkText = (roleCounts[role] == roleMaxCounts[role]) ? ' ✅' : (roleCounts[role] > roleMaxCounts[role]) ? ' ⏳' : ' ❌';
            const countText = roleCounts[role] + '/' + roleMaxCounts[role] + checkText;
            room.visual.text(role, infoPos.x + 2, index, { align: 'left' });
            room.visual.text(countText, infoPos.x + 9, index, { align: 'right' });
            index++;
        }
    }
}

export const visualController = function (): void {
    for (const roomName in Game.rooms) {
        const room: Room = Game.rooms[roomName];
        if (!room.my) continue;

        // 显示Spawn孵化进度
        room.spawns.forEach(spawn => {
            if (spawn.spawning) {
                const spawnPercent = ((spawn.spawning.needTime - spawn.spawning.remainingTime) / spawn.spawning.needTime * 100).toFixed(2);
                const role = Game.creeps[spawn.spawning.name].memory.role;
                room.visual.text(role + ' ' + spawnPercent + ' %', spawn.pos.x, spawn.pos.y + 2, { align: 'center' });
            }
        });

        // 显示控制器升级进度
        if (room.controller) {
            const controllerPercent = (room.controller.progress / room.controller.progressTotal * 100).toFixed(2);
            room.visual.text(controllerPercent + ' %' + '', room.controller.pos.x, room.controller.pos.y + 2, { align: 'center' });
        }

        // 显示部分建筑能量存储信息
        [...room.containers, ...room.towers].forEach(structure => {
            if (structure) {
                var showText = (structure.store.getUsedCapacity(RESOURCE_ENERGY) / structure.store.getCapacity(RESOURCE_ENERGY) * 100).toFixed(2) + ' %';
                room.visual.text(showText, structure.pos.x, structure.pos.y + 2, { align: 'center' });
            }
        })

        // 显示Storage能量存储信息
        if (room.storage) {
            room.visual.text(room.storage.store[RESOURCE_ENERGY].toString(), room.storage.pos.x, room.storage.pos.y + 2, { align: 'center' });
        }

        showCreepCountInfo(room);
    }
}
