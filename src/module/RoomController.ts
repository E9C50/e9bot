import { baseLayout, reactionConfig, reactionSource } from "settings"
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
    if ((childList.includes(child[0]) || child1Amount >= 5) && (childList.includes(child[1]) || child2Amount >= 5)
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
    return (child1Amount >= 5 && child2Amount >= 5) && targetAmount < (reactionConfig[reactionTarget] || 3000)
}

/**
 * 自动更新反应配置
 * @param room
 * @returns
 */
function updateReactionConfig(room: Room): void {
    if (Game.time % 100 != 0) return
    // 如果房间没有配置好两个sourceLab，就跳过
    if (room.memory.roomStructurePos.sourceLab1 == undefined || !room.memory.roomStructurePos.sourceLab2 == undefined) return

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

/**
 * 判断是否可作为基地中央，并返回沼泽位置数量
 * @param {*} terrain
 * @param {*} posx
 * @param {*} posy
 * @param {*} baseSize
 * @returns
 */
function canBeRoomCenter(terrain, posx, posy, baseSize) {
    const harfBaseSize = Math.floor(baseSize / 2);
    var swampCount = 0;
    for (let x = posx - harfBaseSize; x <= posx + harfBaseSize; x++) {
        for (let y = posy - harfBaseSize; y <= posy + harfBaseSize; y++) {
            if (x == 2 || y == 2 || x == 48 || y == 48 || terrain.get(x, y) === TERRAIN_MASK_WALL) {
                return [false, Infinity];
            }
            if (terrain.get(x, y) === TERRAIN_MASK_SWAMP) {
                swampCount += 1;
            }
        }
    }
    return [true, swampCount];
}

/**
 * 自动查找可作为基地中央的位置
 * @param room
 * @param baseSize
 * @returns
 */
function autoComputeCenterPos(room: Room, baseSize: number = 13) {
    const planFlag = Game.flags['planRoomCenter']
    if (planFlag != undefined && planFlag.pos.roomName == room.name) {
        room.memory.roomCustom.computeRoomCenter = 3
        planFlag.remove()
    }
    if (!room.memory.roomCustom.computeRoomCenter) return
    room.memory.roomCustom.computeRoomCenter--

    const cpu = Game.cpu.getUsed()

    const terrain = room.getTerrain();
    var minSwamp = Infinity;
    var autoSelectCenter: RoomPosition | undefined = undefined;
    const ROOM_MAX_SIZE = 49;

    // 遍历所有地块
    for (let i = 0; i < ROOM_MAX_SIZE; i++) {
        for (let j = 0; j < ROOM_MAX_SIZE; j++) {
            const result = canBeRoomCenter(terrain, i, j, baseSize);
            const canBeCenter = result[0];
            const swampCount: number = result[1] as number
            if (canBeCenter) {
                if (swampCount < minSwamp) {
                    minSwamp = swampCount;
                    autoSelectCenter = new RoomPosition(i, j, room.name);
                }
                room.visual.text(swampCount.toString(), i, j, { align: 'center' });
            }
        }
    }

    console.log(room.name, '自动计算RoomCenter', Game.cpu.getUsed() - cpu)
    return autoSelectCenter;
}

/**
 * 检查控制器等级，自动规划
 * @param {*} room
 */
function releaseConstructionSite(room: Room): void {
    // room.constructionSites.forEach(constructionSite => {
    //     constructionSite.remove()
    // });

    const roomCenter = room.memory.roomPosition.centerPos;

    if (!roomCenter) return
    if (Game.time % 10 != 0) return
    if (room.controller == undefined) return
    if (room.level == 8 && (room.nuker != undefined || room.constructionSites.length > 0)) return
    if (room.level < 8 && (room.controller.progress == 0 || room.controller.progress > 100)) return

    const cpu = Game.cpu.getUsed()

    for (let level in baseLayout) {
        if (room.level < parseInt(level)) {
            continue;
        }
        for (let index in baseLayout[level]) {
            const constructionPosList = baseLayout[level][index];
            for (let posIndex in constructionPosList) {
                const posOffset = constructionPosList[posIndex];
                const constructionPosX = roomCenter.x + posOffset[0];
                const constructionPosY = roomCenter.y + posOffset[1];
                const constructionPos = new RoomPosition(constructionPosX, constructionPosY, room.name);

                const constructionAtPos = constructionPos.lookFor(LOOK_CONSTRUCTION_SITES);
                const structureAtPos = constructionPos.lookFor(LOOK_STRUCTURES);
                const rampartAtPos = structureAtPos.filter(structure => structure.structureType == STRUCTURE_RAMPART);

                if (constructionAtPos.length == 0 && (structureAtPos.length == 0
                    || (index == STRUCTURE_RAMPART && rampartAtPos.length == 0))) {
                    constructionPos.createConstructionSite(index as BuildableStructureConstant);
                }
            }
        }
    }

    // Mineral上面发布Extractor
    if (room.level >= 6 && !room.extractor) {
        const mineralPos = room.mineral.pos;
        mineralPos.createConstructionSite(STRUCTURE_EXTRACTOR);
    }

    console.log(room.name, '自动放置建筑', Game.cpu.getUsed() - cpu)
}

/**
 * 初始化建筑相关信息
 * @param room
 */
function initialStructures(room: Room): void {
    [...room.towers, ...room.labs, ...room.spawns, ...room.links, room.powerSpawn, room.nuker].forEach(
        structure => {
            if (structure != undefined && typeof structure.init === 'function') {
                structure.init()
            }
        }
    )

    // 自动设置允许修理的塔
    if (room.memory.roomStructurePos.towerAllowRepair == undefined && room.towers.length > 0) {
        room.createFlag(room.towers[0].pos.x, room.towers[0].pos.y, 'repairTower')
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
        if (room.memory.roomStructurePos == undefined) room.memory.roomStructurePos = {}
        if (room.memory.structureIdList == undefined) room.memory.structureIdList = {}
        if (room.memory.freeSpaceCount == undefined) room.memory.freeSpaceCount = {}
        if (room.memory.roomPosition == undefined) room.memory.roomPosition = {}
        if (room.memory.roomFillJob == undefined) room.memory.roomFillJob = {}
        if (room.memory.roomCustom == undefined) room.memory.roomCustom = {}

        if (!room.my) continue;

        // 自动计算RoomCenter
        autoComputeCenterPos(room)

        // 自动规划
        releaseConstructionSite(room)

        // 初始化建筑相关
        initialStructures(room)

        // 更新Lab反应
        updateReactionConfig(room)
    }
}
