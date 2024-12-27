import { roleBaseEnum } from "constant";
import { sha1String } from "utils";


// function insertByPriority(room: Room, creepNameHash: string, priority: number): string[] {
//     let arr = room.creepConfig
//     let inserted = false;
//     for (let i = 0; i < arr.length; i++) {
//         if (priority > arr[i].priority) {
//             arr.splice(i, 0, { creepNameHash, priority });
//             inserted = true;
//             break;
//         }
//     }
//     if (!inserted) {
//         arr.push({ creepNameHash, priority });
//     }
//     return arr.map(item => item.str);
// }

/**
 * 添加需求配置
 * @param room
 * @param creepRole
 * @param creepName
 * @param creepMemory
 * @returns
 */
function addCreepConfig(room: Room, creepRole: CreepRoleConstant, creepName: string, creepData: CreepData): void {
    const creepNameHash = creepRole + '_' + sha1String(creepName)
    if (creepNameHash in room.creepConfig) return

    room.creepConfig[creepNameHash] = {
        role: creepRole,
        working: false,
        ready: false,
        spawnRoom: room.name,
        data: creepData
    }
}

/**
 * 检查房间信息，发布对应Creep需求
 */
function releaseCreepConfig(): void {
    for (const roomName in Game.rooms) {
        const room: Room = Game.rooms[roomName];
        if (!room.my) continue;

        // 根据矿产情况发布矿工
        room.sources.forEach(source => {
            let canHarvesterPos: number = source.freeSpaceCount;
            canHarvesterPos = Math.min(canHarvesterPos, 2);
            if (room.level > 3) canHarvesterPos = 1;
            for (let i = 0; i < canHarvesterPos; i++) {
                const creepName = room.name + 'HARVESTER' + i
                addCreepConfig(room, roleBaseEnum.HARVESTER, creepName, { sourceTarget: source.id })
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
export const creepNumberController = function (intrval: number = 5): void {
    if (Game.time % intrval) return

    // 清除死亡的Creeps
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // 发布需求配置
    releaseCreepConfig()
}
