import { reactionSource } from "constant"
import { reactionConfig } from "settings"
import { getRoomResourceByType } from "utils"

/**
 * 检查是否符合反应条件
 * @param room
 * @param reactionTarget
 * @returns
 */
function getReadyChildReaction(room: Room, reactionTarget: ResourceConstant): ResourceConstant[] {
    const child: ResourceConstant[] = reactionSource[reactionTarget]
    if (!child) return []

    var child1List = getReadyChildReaction(room, child[0])
    var child2List = getReadyChildReaction(room, child[1])

    const child1Amount = getRoomResourceByType(room, child[0])
    const child2Amount = getRoomResourceByType(room, child[1])

    var childList: ResourceConstant[] = [...child1List, ...child2List]
    if ((childList.includes(child[0]) || child1Amount > 0) && (childList.includes(child[1]) || child2Amount > 0)) {
        childList = childList.concat([reactionTarget])
    }
    return childList
}

function checkReactionReady(room: Room, reactionTarget: ResourceConstant): boolean {
    const child: ResourceConstant[] = reactionSource[reactionTarget]
    const child1Amount = getRoomResourceByType(room, child[0])
    const child2Amount = getRoomResourceByType(room, child[1])
    const targetAmount = getRoomResourceByType(room, reactionTarget)
    return (child1Amount > 0 && child2Amount > 0) || targetAmount > 30000
}

/**
 * 自动更新反应配置
 * @param room
 * @returns
 */
function autoGetReactionConfig(room: Room): void {
    // 如果房间没有配置好两个sourceLab，就跳过
    if (!room.memory.sourceLab1 || !room.memory.sourceLab2) return

    if (room.memory.labReactionQueue.length > 0 && !checkReactionReady(room, room.memory.labReactionQueue[0])) {
        console.log(`Lab合成配置更新前：${room.memory.labReactionQueue}`)
        room.memory.labReactionQueue.shift()
        console.log(`Lab合成配置更新后：${room.memory.labReactionQueue}`)
    }

    if (room.memory.labReactionQueue.length > 0) return

    for (let config in reactionConfig) {
        if (getRoomResourceByType(room, config as ResourceConstant) < reactionConfig[config]) {
            const readyReactionList = getReadyChildReaction(room, config as ResourceConstant)
            console.log(`Lab合成配置更新前：${room.memory.labReactionQueue}`)
            room.memory.labReactionQueue = readyReactionList
            console.log(`Lab合成配置更新后：${room.memory.labReactionQueue}`)
            return
        }
    }
}

export const roomController = function (): void {
    for (const roomName in Game.rooms) {
        const room: Room = Game.rooms[roomName];
        if (!room.my) continue;

        if (room.memory.labReactionQueue == undefined) room.memory.labReactionQueue = []
        if (room.memory.structureIdList == undefined) room.memory.structureIdList = {}
        if (room.memory.freeSpaceCount == undefined) room.memory.freeSpaceCount = {}

        autoGetReactionConfig(room)
    }
}
