export const structureWorkController = function (): void {
    for (const roomName in Game.rooms) {
        const room: Room = Game.rooms[roomName];
        if (!room.my) continue;

        room.structures.forEach(structure => {
            if (typeof structure.doWork === 'function') structure.doWork()
        })
    }
}
