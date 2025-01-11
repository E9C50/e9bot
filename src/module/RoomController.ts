import { baseLayout, boostConfig, creepWhiteList, reactionConfig, reactionSource } from "settings"
import { getClosestTarget } from "utils"

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

    const child1Amount = room.memory.resourceAmount[child[0]]
    const child2Amount = room.memory.resourceAmount[child[1]]
    const targetAmount = room.memory.resourceAmount[reactionTarget]

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
    const child1Amount = room.memory.resourceAmount[child[0]]
    const child2Amount = room.memory.resourceAmount[child[1]]
    const targetAmount = room.memory.resourceAmount[reactionTarget]
    return (child1Amount >= 5 && child2Amount >= 5) && targetAmount < (reactionConfig[reactionTarget] || 3000)
}

/**
 * 自动更新反应配置
 * @param room
 * @returns
 */
function updateLabReactionConfig(room: Room): void {
    if (Game.time % 100 != 0) return
    if (room.memory.roomCustom.labBoostMod) return
    // 如果房间没有配置好两个sourceLab，就跳过
    if (room.memory.roomStructurePos.sourceLab1 == undefined || !room.memory.roomStructurePos.sourceLab2 == undefined) return

    if (room.memory.labReactionQueue.length > 0 && !checkReactionReady(room, room.memory.labReactionQueue[0])) {
        console.log(`Lab合成配置更新前：${room.memory.labReactionQueue}`)
        room.memory.labReactionQueue.shift()
        console.log(`Lab合成配置更新后：${room.memory.labReactionQueue}`)
    }

    if (room.memory.labReactionQueue.length > 0) return

    for (let config in reactionConfig) {
        if (room.memory.resourceAmount[config] >= reactionConfig[config]) continue
        const readyReactionList = getReadyChildReaction(room, config as ResourceConstant)
        if (!readyReactionList.includes(config as ResourceConstant)) continue

        console.log(`Lab合成配置更新前：${room.memory.labReactionQueue}`)
        room.memory.labReactionQueue = readyReactionList
        console.log(`Lab合成配置更新后：${room.memory.labReactionQueue}`)
        console.log(`notify_Lab合成配置更新：${room.memory.labReactionQueue}`)
        return
    }
}

function updateLabBoostConfig(room: Room): void {
    if (Game.time % 10 != 0) return
    if (!room.memory.roomCustom.labBoostMod) return
    if (room.memory.labBoostConfig == undefined) return

    const labBoostConfig = {}
    Object.keys(boostConfig.WAR).forEach(configPart => {
        if (boostConfig.WAR[configPart].length > 0) {
            const emptyLabId = room.labs.filter(lab => labBoostConfig[lab.id] == undefined)[0].id

            const resourceTypeT3 = boostConfig.WAR[configPart][2]
            if (room.memory.resourceAmount[resourceTypeT3] > 0) {
                labBoostConfig[emptyLabId] = { resourceType: resourceTypeT3, bodyPart: configPart as BodyPartConstant }
                return
            }
            const resourceTypeT2 = boostConfig.WAR[configPart][1]
            if (room.memory.resourceAmount[resourceTypeT2] > 0) {
                labBoostConfig[emptyLabId] = { resourceType: resourceTypeT2, bodyPart: configPart as BodyPartConstant }
                return
            }
            const resourceTypeT1 = boostConfig.WAR[configPart][0]
            if (room.memory.resourceAmount[resourceTypeT1] > 0) {
                labBoostConfig[emptyLabId] = { resourceType: resourceTypeT1, bodyPart: configPart as BodyPartConstant }
                return
            }
        }
    });

    room.memory.labBoostConfig = labBoostConfig
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
        room.memory.roomCustom.computeRoomCenterShow = 3
        planFlag.remove()
    }
    if (!room.memory.roomCustom.computeRoomCenterShow) return
    room.memory.roomCustom.computeRoomCenterShow--

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

function findTowerEnemy(room: Room): void {
    if (Game.time % 5 != 0) return
    if (room.enemies.length == 0) return
    var enemys = room.enemies.filter(creep => !creepWhiteList.includes(creep.owner.username)
        && creep.body.some(part => part.type === RANGED_ATTACK))

    if (enemys.length == 0) {
        enemys = room.enemies.filter(creep => !creepWhiteList.includes(creep.owner.username)
            && creep.body.some(part => part.type === ATTACK))
    }
    if (enemys.length == 0) {
        enemys = room.enemies.filter(creep => !creepWhiteList.includes(creep.owner.username)
            && creep.body.some(part => part.type === HEAL))
    }
    if (enemys.length == 0) {
        enemys = room.enemies.filter(creep => !creepWhiteList.includes(creep.owner.username))
    }

    if (enemys.length > 0) {
        console.log(`notify_您的房间[${room.name}] 发现敌人 所有者[${enemys[0].owner.username}]`)
    }

    if (room.spawns.length == 0) return

    const enemyFind = getClosestTarget(room.spawns[0].pos, enemys)
    if (enemyFind == undefined && room.memory.enemyTarget == undefined) {
        return
    }

    const enemyLast: Creep | undefined = room.memory.enemyTarget == undefined ?
        undefined : Game.getObjectById(room.memory.enemyTarget) as Creep

    if (room.memory.enemyTarget != undefined && Game.getObjectById(room.memory.enemyTarget) == undefined) {
        room.memory.enemyTarget = undefined
    }

    if (room.memory.enemyTarget != undefined && enemyLast != undefined &&
        enemyLast.body.some(part => part.type == ATTACK || part.type == RANGED_ATTACK)) {
        room.memory.enemyTarget = enemyFind.id
    }

    if (room.memory.enemyTarget == undefined) {
        room.memory.enemyTarget = enemyFind.id
    }
}

function cacheRoomResourceInfo(room: Room): void {
    room.memory.resourceAmount = {}
    if (room.storage != undefined) {
        const storage = room.storage
        Object.keys(storage.store).forEach(store => {
            if (room.memory.resourceAmount[store] == undefined) {
                room.memory.resourceAmount[store] = 0
            }
            room.memory.resourceAmount[store] += storage.store[store]
        });
    }

    if (room.labs.length > 0) {
        room.labs.forEach(lab => {
            if (lab.mineralType == undefined) return
            if (room.memory.resourceAmount[lab.mineralType] == undefined) {
                room.memory.resourceAmount[lab.mineralType] = 0
            }
            room.memory.resourceAmount[lab.mineralType] += lab.store[lab.mineralType]
        })
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
        if (room.memory.labBoostConfig == undefined) room.memory.labBoostConfig = {}
        if (room.memory.freeSpaceCount == undefined) room.memory.freeSpaceCount = {}
        if (room.memory.resourceAmount == undefined) room.memory.resourceAmount = {}
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

        // 缓存房间资源信息
        cacheRoomResourceInfo(room)

        // 更新Lab Boost配置
        updateLabBoostConfig(room)

        // 更新Lab反应配置
        updateLabReactionConfig(room)

        // 更新房间内敌人信息
        findTowerEnemy(room)
    }
}
