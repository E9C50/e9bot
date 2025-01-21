import { baseLayout, boostConfig, creepWhiteList, reactionConfig, reactionSource, roomSignTextList } from "settings"
import { getClosestTarget, getDistance } from "utils"

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

    const child1Amount = room.memory.resourceAmount[child[0]] || 0
    const child2Amount = room.memory.resourceAmount[child[1]] || 0
    const targetAmount = room.memory.resourceAmount[reactionTarget] || 0

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
    const child1Amount = room.memory.resourceAmount[child[0]] || 0
    const child2Amount = room.memory.resourceAmount[child[1]] || 0
    const targetAmount = room.memory.resourceAmount[reactionTarget] || 0
    return (child1Amount >= 5 && child2Amount >= 5) && targetAmount < (reactionConfig[reactionTarget] || 3000)
}

/**
 * 自动更新反应配置
 * @param room
 * @returns
 */
function updateLabReactionConfig(room: Room): void {
    if (Game.time % 10 != 0) return
    if (room.labs.length == 0) return
    // 如果房间没有配置好两个sourceLab，就跳过
    if (room.memory.roomLabConfig.sourceLab1 == undefined || !room.memory.roomLabConfig.sourceLab2 == undefined) return

    if (room.memory.roomLabConfig.labReactionQueue.length > 0 && !checkReactionReady(room, room.memory.roomLabConfig.labReactionQueue[0])) {
        console.log(`Lab合成配置更新前：${room.memory.roomLabConfig.labReactionQueue}`)
        room.memory.roomLabConfig.labReactionQueue.shift()
        console.log(`Lab合成配置更新后：${room.memory.roomLabConfig.labReactionQueue}`)
    }

    if (room.memory.roomLabConfig.labReactionQueue.length > 0) return

    for (let config in reactionConfig) {
        if ((room.memory.resourceAmount[config] || 0) >= reactionConfig[config]) continue
        const readyReactionList = getReadyChildReaction(room, config as ResourceConstant)
        if (!readyReactionList.includes(config as ResourceConstant)) continue

        console.log(`Lab合成配置更新前：${room.memory.roomLabConfig.labReactionQueue}`)
        room.memory.roomLabConfig.labReactionQueue = readyReactionList
        console.log(`Lab合成配置更新后：${room.memory.roomLabConfig.labReactionQueue}`)
        console.log(`notify_Lab合成配置更新：${room.memory.roomLabConfig.labReactionQueue}`)
        return
    }
}

function updateLabBoostConfig(room: Room): void {
    if (Game.time % 10 != 0) return
    if (room.labs.length == 0) return
    const labConfig = room.memory.roomLabConfig
    labConfig.singleLabConfig = {}

    Object.keys(boostConfig).forEach(configType => {
        if (boostConfig[configType].length > 0) {
            const emptyLabId = room.labs.filter(lab => lab.id != labConfig.sourceLab1 && lab.id != labConfig.sourceLab2 && (labConfig.singleLabConfig[lab.id] == undefined || !labConfig.singleLabConfig[lab.id].boostMode))[0]?.id

            if (emptyLabId == undefined) return
            const resourceTypeT3 = boostConfig[configType][2]
            if ((room.memory.resourceAmount[resourceTypeT3] || 0) > 0) {
                labConfig.singleLabConfig[emptyLabId] = { resourceType: resourceTypeT3, boostMode: true, boostType: configType as BoostTypeConstant }
                return
            }
            const resourceTypeT2 = boostConfig[configType][1]
            if ((room.memory.resourceAmount[resourceTypeT2] || 0) > 0) {
                labConfig.singleLabConfig[emptyLabId] = { resourceType: resourceTypeT2, boostMode: true, boostType: configType as BoostTypeConstant }
                return
            }
            const resourceTypeT1 = boostConfig[configType][0]
            if ((room.memory.resourceAmount[resourceTypeT1] || 0) > 0) {
                labConfig.singleLabConfig[emptyLabId] = { resourceType: resourceTypeT1, boostMode: true, boostType: configType as BoostTypeConstant }
                return
            }
        }
    });
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
    if (planFlag == undefined || planFlag.pos.roomName != room.name) return

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

/**
 * 更新房间内敌人信息
 * @param room
 * @returns
 */
function findTowerEnemy(room: Room): void {
    if (Game.time % 5 != 0 && !Memory.warMode) return
    if (room.enemies.length == 0) {
        if (Memory.warMode[room.name]) {
            console.log(room.name, '战争模式已关闭')
            Memory.warMode[room.name] = false
        }
        return
    }

    // 筛选值得开启战争模式的Creeps
    const enemyList = room.enemies.filter(enemy => {
        const isNotNpc = enemy.owner.username != 'Invader' && enemy.owner.username != 'Source Keeper'
        const isAttacker = enemy.body.filter(body => body.type == 'attack' || body.type == 'ranged_attack' || body.type == 'work').length > 0
        return isNotNpc && isAttacker
    })

    if (enemyList.length > 0) {
        Memory.warMode[room.name] = true
        console.log(room.name, '战争模式已开启')
        console.log(`notify_您的房间[${room.name}] 发现敌人 所有者[${room.enemies[0].owner.username}]`)
    }

    // 查找离ram最近的敌人
    var closestRange = Infinity
    var closestTarget = room.enemies[0]
    room.enemies.forEach(enemy => {
        room.ramparts.forEach(ram => {
            const range = getDistance(enemy.pos, ram.pos)
            if (range < closestRange) {
                closestRange = range
                closestTarget = enemy
            }
        })
    })

    room.memory.enemyTarget = closestTarget.id
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

    if (room.terminal != undefined) {
        const terminal = room.terminal
        Object.keys(terminal.store).forEach(store => {
            if (room.memory.resourceAmount[store] == undefined) {
                room.memory.resourceAmount[store] = 0
            }
            room.memory.resourceAmount[store] += terminal.store[store]
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

function updateRoomSign(room: Room) {
    if (room.memory.roomSignText == undefined) {
        const existsSigns = Object.values(Game.rooms).map(item => item.memory.roomSignText)
        const unusedSigns = roomSignTextList.filter(item => !existsSigns.includes(item));
        const randomIndex = Math.floor(Math.random() * unusedSigns.length);
        room.memory.roomSignText = unusedSigns[randomIndex]
    }
}

function autoEnableSafeMode(room: Room) {
    const controller = room.controller
    if (controller == undefined) return
    if (controller.safeModeAvailable == 0) return
    if (controller.safeModeCooldown == undefined) return
    if (controller.safeModeCooldown > 0) return
    if (room.enemies.length == 0) return

    if (room.storage != undefined && room.storage.hits < room.storage.hitsMax) {
        controller.activateSafeMode()
        console.log(`notify_您的房间[${room.name}] [storage]受到攻击，安全模式已激活`)
        return
    }
    if (room.terminal != undefined && room.terminal.hits < room.terminal.hitsMax) {
        controller.activateSafeMode()
        console.log(`notify_您的房间[${room.name}] [terminal]受到攻击，安全模式已激活`)
        return
    }
    if (room.spawns.length == 1 && room.spawns[0].hits < room.spawns[0].hitsMax) {
        controller.activateSafeMode()
        console.log(`notify_您的房间[${room.name}] [spawns]受到攻击，安全模式已激活`)
        return
    }
}

export const roomController = function (): void {
    for (const roomName in Game.rooms) {
        const room: Room = Game.rooms[roomName];

        const updateFlag = Game.flags['updateCache']
        if (updateFlag != undefined && updateFlag.pos.roomName == roomName) {
            room.memory.needUpdateCache = true
            updateFlag.remove()
        }

        // 更新缓存
        if (room.memory.needUpdateCache) {
            global.BetterMove.deletePathInRoom(room.name)
            room.memory.structureIdList = {}
            room.memory.needUpdateCache = false
            console.log('更新建筑缓存', roomName)
        }

        if (Memory.warMode == undefined) Memory.warMode = {}
        if (room.memory.roomLabConfig == undefined) room.memory.roomLabConfig = { labReactionQueue: [], singleLabConfig: {} }

        if (room.memory.roomStructurePos == undefined) room.memory.roomStructurePos = {}
        if (room.memory.structureIdList == undefined) room.memory.structureIdList = {}
        if (room.memory.resourceAmount == undefined) room.memory.resourceAmount = {}
        if (room.memory.restrictedPos == undefined) room.memory.restrictedPos = {}
        if (room.memory.roomPosition == undefined) room.memory.roomPosition = {}
        if (room.memory.roomFillJob == undefined) room.memory.roomFillJob = {}
        if (room.memory.teamConfig == undefined) room.memory.teamConfig = {}

        room.memory.roomFillJob.labInMineral = []

        if (!room.my) continue;

        // 自动开启安全模式
        autoEnableSafeMode(room)

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

        // 更新房间签名
        updateRoomSign(room)
    }
}
