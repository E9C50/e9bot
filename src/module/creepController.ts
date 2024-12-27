/**
 * 检查房间信息，发布对应Creep需求
 */
function releaseCreepConfig(): void {
    for (const roomName in Game.rooms) {
        const room: Room = Game.rooms[roomName];
        if (!room.my) continue;

        room.sources.forEach(source => {
            let canHarvesterPos: number = source.freeSpaceCount;
            canHarvesterPos = Math.min(canHarvesterPos, 2);
            if (room.level > 3) canHarvesterPos = 1;
            for (let i = 0; i < canHarvesterPos; i++) {
                // addCreepConfig(room.name, 'harvester', 'Harvester', source.id, i);
            }
        });

    }
}

/**
 * creep 的数量控制器
 * 负责发现死去的 creep 并检查其是否需要再次孵化
 *
 * @param intrval 搜索间隔
 */
export default function creepNumberListener(intrval: number = 5): void {
    if (Game.time % intrval) return

    // 清除死亡的Creeps
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    releaseCreepConfig()
}
