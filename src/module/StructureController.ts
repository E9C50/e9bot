export const structureController = function (): void {
    for (const roomName in Game.rooms) {
        const room: Room = Game.rooms[roomName];
        if (!room.my) continue;

        // 生产Creep
        room.spawnCreep();

    }
}
