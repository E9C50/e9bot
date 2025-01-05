export const structureWorkController = function (): void {
    for (const roomName in Game.rooms) {
        const room: Room = Game.rooms[roomName];
        if (!room.my) continue;

        // [...room.towers, ...room.labs, ...room.spawns, ...room.links]
        [...room.towers, ...room.labs, ...room.spawns, ...room.links, room.powerSpawn].forEach(structure => {
            if (structure != undefined && typeof structure.doWork === 'function') structure.doWork()
        })
    }
}
