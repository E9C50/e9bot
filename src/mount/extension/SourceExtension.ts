export default class SourceExtension extends Source {
    public freeSpaceCountGetter(): number {
        if (this.room == undefined) return 0
        if (this.room.memory.freeSpaceCount[this.id] != undefined) {
            return this.room.memory.freeSpaceCount[this.id]
        }

        const terrain = this.room.getTerrain();
        if (this.room.memory.freeSpaceCount == undefined)
            this.room.memory.freeSpaceCount = {}

        if (this.room.memory.freeSpaceCount[this.id] == undefined) {
            let freeSpaceCount = 0;
            [this.pos.x - 1, this.pos.x, this.pos.x + 1].forEach(x => {
                [this.pos.y - 1, this.pos.y, this.pos.y + 1].forEach(y => {
                    if (terrain.get(x, y) != TERRAIN_MASK_WALL)
                        freeSpaceCount++;
                }, this);
            }, this);
            this.room.memory.freeSpaceCount[this.id] = freeSpaceCount;
        }
        return this.room.memory.freeSpaceCount[this.id]
    }
}
