import { reactionSource } from "constant"
import { reactionConfig } from "settings"
import { getRoomResourceByType } from "utils"

/**
 * 检查是否符合反应条件
 * @param room
 * @param reactionTarget
 * @returns
 */
function checkReaction(room: Room, reactionTarget: ResourceConstant) {
    const config: string[] = reactionSource[reactionTarget]
    const resourceAmount1 = getRoomResourceByType(room, config[0] as ResourceConstant)
    const resourceAmount2 = getRoomResourceByType(room, config[1] as ResourceConstant)
    const targetResource = getRoomResourceByType(room, reactionTarget)
    return resourceAmount1 > 1000 && resourceAmount2 > 1000 && targetResource < reactionConfig[reactionTarget]
}

/**
 * 自动获取反应配置
 * @param room
 * @returns
 */
function autoGetReactionConfig(room: Room): void {
    // 如果房间没有配置好两个sourceLab，就跳过
    if (!room.memory.sourceLab1 || !room.memory.sourceLab2) return

    // 如果房间中有反应配置，且符合反应条件，就不做任何操作
    if (room.memory.labReaction != undefined && checkReaction(room, room.memory.labReaction)) return

    // 循环reactionConfig，检查两个底物是否都大于1000
    for (const reactionResource of Object.keys(reactionConfig)) {
        if (checkReaction(room, reactionResource as ResourceConstant)) {
            room.memory.labReaction = reactionResource as ResourceConstant
            console.log(`[${room.name}] 已自动配置反应配方 ${reactionResource}`)
            return
        }
    }
}

export const roomController = function (): void {
    for (const roomName in Game.rooms) {
        const room: Room = Game.rooms[roomName];
        if (!room.my) continue;
        autoGetReactionConfig(room)
    }
}
