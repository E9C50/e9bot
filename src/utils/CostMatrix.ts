export function generateCostMatrix(roomName: string) {
    const debug = false
    if (debug) console.log(`[${roomName}] DefenseCostMatrix生成开销:`);
    const CPU_start = Game.cpu.getUsed();
    const costs = new PathFinder.CostMatrix();
    const room = Game.rooms[roomName]

    // 标记不可通过的地形
    const terrain = room.getTerrain();
    for (let i = 0; i < 50; i++) {
        for (let j = 0; j < 50; j++) {
            if (i == 0 || i == 49 || j == 0 || j == 49) {
                costs.set(i, j, 255);
                continue;
            }
            if (terrain.get(i, j) == TERRAIN_MASK_WALL) {
                costs.set(i, j, 255);
                continue;
            }
        }
    }

    // 标记不可通过的建筑
    const blockingStructures = room.find(FIND_STRUCTURES, {
        filter: s => [
            STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER,
            STRUCTURE_LINK, STRUCTURE_LAB, STRUCTURE_CONTAINER,
            STRUCTURE_WALL, STRUCTURE_TERMINAL, STRUCTURE_STORAGE,
            STRUCTURE_NUKER, STRUCTURE_FACTORY, STRUCTURE_OBSERVER,
            STRUCTURE_POWER_SPAWN, STRUCTURE_EXTRACTOR
        ].includes(s.structureType as any)
    });
    blockingStructures.forEach(s => costs.set(s.pos.x, s.pos.y, 255));

    // 标记rampart;
    const ramparts = room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_RAMPART
    });

    // source旁边的rampart
    const rampartIds = room.sources.reduce<Structure[]>((acc, source) =>
        [...acc, ...ramparts.filter(rampart => rampart.pos.inRangeTo(source.pos, 3))], []
    ).map(rampart => rampart.id);

    ramparts.forEach(r => {
        if (costs.get(r.pos.x, r.pos.y) === 0) costs.set(r.pos.x, r.pos.y, 1);
        if (rampartIds.includes(r.id)) costs.set(r.pos.x, r.pos.y, 255);
    });

    if (debug) console.log('- 建筑标记开销:', Game.cpu.getUsed() - CPU_start);

    const CPU_BFS = Game.cpu.getUsed();

    //获取出口
    let exits: RoomPosition[] = [];
    if (global['ROOM_EXIT'] && global['ROOM_EXIT'][roomName]) {
        exits = global['ROOM_EXIT'][roomName];
    } else {
        global['ROOM_EXIT'] = global['ROOM_EXIT'] || {};
        global['ROOM_EXIT'][roomName] = room.find(FIND_EXIT);
        exits = global['ROOM_EXIT'][roomName];
    }

    // BFS
    const visited = new Uint8Array(2500);
    const barriers = new Set<number>();
    const queue = [...exits.map(e => [e.x, e.y])];
    let index = 0
    while (index < queue.length) {
        const [x, y] = queue[index++];
        const posKey = x * 50 + y;
        if (visited[posKey]) continue;
        visited[posKey] = 1;
        costs.set(x, y, 254);
        // 扩散
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx == 0 && dy == 0) continue;
                const nx = x + dx, ny = y + dy;
                if (nx < 1 || nx > 48 || ny < 1 || ny > 48) continue;
                const neighborKey = nx * 50 + ny;
                if (visited[neighborKey]) continue;
                // 如果此处大于0, 表示达到了不可移动的位置(255的墙或1的rampart)
                // 记作边缘
                const terrainCost = costs.get(nx, ny);
                if (terrainCost > 0) {
                    visited[neighborKey] = 1;
                    barriers.add((nx << 6) | ny);
                    continue;
                }
                queue.push([nx, ny]);
            }
        }
    }

    if (debug) console.log('- BFS开销:', Game.cpu.getUsed() - CPU_BFS);
    let CPU_barrier = Game.cpu.getUsed();

    barriers.forEach(posKey => {
        const x = posKey >> 6;
        const y = posKey & 0b111111;
        for (let dx = -2; dx <= 2; dx++) {
            for (let dy = -2; dy <= 2; dy++) {
                if (dx == 0 && dy == 0) continue;
                const nx = x + dx, ny = y + dy;
                if (nx < 1 || nx > 48 || ny < 1 || ny > 48) continue;
                if (costs.get(nx, ny) > 0) continue;
                costs.set(nx, ny, 10);
            }
        }
    })

    const CPU_end = Game.cpu.getUsed();

    if (debug) console.log('- 黄区开销:', CPU_end - CPU_barrier);
    if (debug) console.log('- 总开销:', CPU_end - CPU_start);
    return costs;
}
