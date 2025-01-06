import { reactionConfig, reactionSource } from "settings"
import { getRoomResourceByType } from "utils"

/**
 * 获取底物反应列表
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
    const targetAmount = getRoomResourceByType(room, reactionTarget)

    var childList: ResourceConstant[] = [...child1List, ...child2List]
    if ((childList.includes(child[0]) || child1Amount > 0) && (childList.includes(child[1]) || child2Amount > 0)
        && targetAmount < (reactionConfig[reactionTarget] || 3000)) {
        childList = childList.concat([reactionTarget])
    }
    return childList
}

/**
 * 检查是否有足够的资源来进行反应
 * @param room
 * @param reactionTarget
 * @returns
 */
function checkReactionReady(room: Room, reactionTarget: ResourceConstant): boolean {
    const child: ResourceConstant[] = reactionSource[reactionTarget]
    const child1Amount = getRoomResourceByType(room, child[0])
    const child2Amount = getRoomResourceByType(room, child[1])
    const targetAmount = getRoomResourceByType(room, reactionTarget)
    return (child1Amount > 0 && child2Amount > 0) && targetAmount < (reactionConfig[reactionTarget] || 3000)
}

/**
 * 自动更新反应配置
 * @param room
 * @returns
 */
function updateReactionConfig(room: Room): void {
    if (Game.time % 100 != 0) return
    // 如果房间没有配置好两个sourceLab，就跳过
    if (room.memory.structureIdList.sourceLab1 == undefined || !room.memory.structureIdList.sourceLab2 == undefined) return

    if (room.memory.labReactionQueue.length > 0 && !checkReactionReady(room, room.memory.labReactionQueue[0])) {
        console.log(`Lab合成配置更新前：${room.memory.labReactionQueue}`)
        room.memory.labReactionQueue.shift()
        console.log(`Lab合成配置更新后：${room.memory.labReactionQueue}`)
    }

    if (room.memory.labReactionQueue.length > 0) return

    for (let config in reactionConfig) {
        if (getRoomResourceByType(room, config as ResourceConstant) >= reactionConfig[config]) continue
        const readyReactionList = getReadyChildReaction(room, config as ResourceConstant)
        if (!readyReactionList.includes(config as ResourceConstant)) continue

        console.log(`Lab合成配置更新前：${room.memory.labReactionQueue}`)
        room.memory.labReactionQueue = readyReactionList
        console.log(`Lab合成配置更新后：${room.memory.labReactionQueue}`)
        console.log(`notify_Lab合成配置更新：${room.memory.labReactionQueue}`)
        return
    }
}

export const roomController = function (): void {
    for (const roomName in Game.rooms) {
        const room: Room = Game.rooms[roomName];

        // 更新缓存
        if (room.memory.needUpdateCache) {
            room.memory.structureIdList = {}
            room.memory.needUpdateCache = false
            console.log('更新建筑缓存', roomName)
        }

        if (room.memory.labReactionQueue == undefined) room.memory.labReactionQueue = []
        if (room.memory.structureIdList == undefined) room.memory.structureIdList = {}
        if (room.memory.freeSpaceCount == undefined) room.memory.freeSpaceCount = {}
        if (room.memory.roomPosition == undefined) room.memory.roomPosition = {}
        if (room.memory.roomCustom == undefined) room.memory.roomCustom = {}

        if (!room.my) continue;

        updateReactionConfig(room)
    }
}
