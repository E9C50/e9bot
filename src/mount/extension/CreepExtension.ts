import { boostBodyPart, boostTypeEnum, findPathAvoidRooms, roleBaseEnum, roleBoostConfig } from "settings";
import { getDistance, getOppositeDirection, getOppositePosition, serializeMovePath } from "utils";

export default class CreepExtension extends Creep {

    /**
     * 转移资源到指定目标
     * @param creep
     * @param transferTarget
     * @param resourceType
     * @returns
     */
    public transferToTarget(transferTarget: Structure, resourceType: ResourceConstant): boolean {
        if (transferTarget == undefined) return false
        if (getDistance(this.pos, transferTarget.pos) <= 1) {
            this.transfer(transferTarget, resourceType)
            return true
        } else {
            this.moveTo(transferTarget)
            return false
        }
    }

    /**
     * 从指定地方取出资源
     * @param takeTarget
     * @param resourceType
     * @param amount
     */
    public takeFromTarget(takeTarget: Structure, resourceType: ResourceConstant, amount?: number): boolean {
        if (takeTarget == undefined) return false
        if (getDistance(this.pos, takeTarget.pos) <= 1) {
            this.withdraw(takeTarget, resourceType, amount)
            return true
        } else {
            this.moveTo(takeTarget)
            return false
        }
    }

    /**
     * 捡起地上的资源
     * @param allSource
     * @param range
     * @returns
     */
    public pickupDroppedResource(allSource: boolean, range: number): boolean {
        // 战争模式不出去捡东西
        if (Memory.warMode[this.room.name]) range = 1
        // 没有携带空间的跳过
        if (this.store.getFreeCapacity() == 0) return false
        const spawnRoomStorage = Game.rooms[this.memory.spawnRoom].storage

        // 优先捡起附近掉落的资源
        const droppedEnergy = this.room.droppedResource.filter(
            resource => resource.amount > 100 && getDistance(resource.pos, this.pos) <= range
        );
        if (droppedEnergy.length > 0) {
            const resource = droppedEnergy[0] as Resource
            if ((allSource && spawnRoomStorage != undefined) || resource.resourceType == RESOURCE_ENERGY) {
                if (getDistance(resource.pos, this.pos) > 1) {
                    this.moveTo(resource);
                } else {
                    this.pickup(resource)
                }
                return true;
            }
        }

        // 查找附近的墓碑和废墟
        const tombstones: Tombstone[] = this.room.tombstones.filter(tombstone =>
            getDistance(tombstone.pos, this.pos) <= range && tombstone.store.getUsedCapacity() > 0
        );
        const ruins: Ruin[] = this.room.ruins.filter(ruin =>
            getDistance(ruin.pos, this.pos) <= range && ruin.store.getUsedCapacity() > 0
        );
        const destroyed: (Tombstone | Ruin)[] = [...ruins, ...tombstones];

        // 捡取资源
        if (destroyed.length > 0) {
            for (let resource in destroyed[0].store) {
                if (resource != RESOURCE_ENERGY && (!allSource || spawnRoomStorage == undefined)) {
                    continue;
                }
                if (getDistance(destroyed[0].pos, this.pos) > 1) {
                    this.moveTo(destroyed[0]);
                } else {
                    this.withdraw(destroyed[0], resource as ResourceConstant)
                }
            }
            return true;
        }
        return false;
    }

    /**
     * 远距离移动
     * @param target
     * @param fleeEnemy
     */
    public farMoveToRoom(targetRoom: string, fleeEnemy?: boolean): CreepMoveReturnCode | ERR_NO_PATH | ERR_NOT_IN_RANGE | ERR_INVALID_TARGET {
        if (this.fatigue > 0) return ERR_TIRED
        if (this.room.name == targetRoom) {
            this.memory.pathCache = undefined
            return OK
        }
        const creep = this
        var target = new RoomPosition(25, 25, targetRoom)

        if (this.memory.pathCache == undefined) {
            let pathFind = PathFinder.search(
                this.pos, [{ pos: target, range: 1 }],
                {
                    plainCost: 2,
                    swampCost: 10,
                    roomCallback: function (roomName) {
                        let costs = new PathFinder.CostMatrix;

                        if (findPathAvoidRooms.includes(roomName)) {
                            return false
                        }

                        let room = Game.rooms[roomName];
                        if (!room) return costs

                        // 优先走路，并且躲开建筑
                        room.structures.forEach(function (struct) {
                            if (struct.structureType === STRUCTURE_ROAD) {
                                costs.set(struct.pos.x, struct.pos.y, 1);
                            } else if (struct.structureType !== STRUCTURE_CONTAINER &&
                                (struct.structureType !== STRUCTURE_RAMPART || !room.my)) {
                                costs.set(struct.pos.x, struct.pos.y, 0xff);
                            }
                        });

                        // 避开房间中的禁止通行点
                        for (const creepName in room.memory.restrictedPos) {
                            // 自己注册的禁止通行点位自己可以走
                            if (creepName === creep.name) continue
                            const pos = room.memory.restrictedPos[creepName]
                            costs.set(pos.x, pos.y, 0xff)
                        }

                        // 躲避敌人
                        if (fleeEnemy) {
                            room.enemies.forEach(enemy => {
                                for (let x = enemy.pos.x - 3; x <= enemy.pos.x + 3; x++) {
                                    for (let y = enemy.pos.y - 3; y <= enemy.pos.y + 3; y++) {
                                        costs.set(x, y, 0xff);
                                    }
                                }
                            })
                        }
                        return costs;
                    },
                }
            );
            this.memory.pathCache = serializeMovePath([this.pos, ...pathFind.path, target])
        }

        if (this.memory.pathCache) {
            // 没有路径视为到达目的地
            if (this.memory.pathCache.length == 0) {
                this.memory.pathCache = undefined
                return OK
            }

            // 根据缓存移动并更新缓存
            const direction = <DirectionConstant>Number(this.memory.pathCache[0])
            const moveResult = this.batterMove(direction)
            if (moveResult == OK) {
                this.memory.pathCache = this.memory.pathCache.substring(1)
            } else {
                this.memory.pathCache = undefined
            }
            return moveResult
        } else {
            this.say('🚫')
            return ERR_NO_PATH
        }
    }

    /**
     * 向指定方向移动
     *
     * @param target 要移动到的方向
     * @returns ERR_INVALID_TARGET 发生撞停
     */
    public batterMove(target: DirectionConstant): CreepMoveReturnCode | ERR_INVALID_TARGET | ERR_NOT_IN_RANGE {
        // 进行移动，并分析其移动结果，OK 时才有可能发生撞停
        const moveResult = this.move(target)
        if (moveResult != OK) return moveResult

        const currentPos = `${this.pos.x}/${this.pos.y}`
        // 如果和之前位置重复了就分析撞上了啥
        if (this.memory.prePos && currentPos == this.memory.prePos) {
            // 尝试对穿，如果自己禁用了对穿的话则直接重新寻路
            const crossResult = this.mutualCross(target)

            // 没找到说明撞墙上了或者前面的 creep 拒绝对穿，重新寻路
            if (crossResult != OK) {
                return ERR_INVALID_TARGET
            }
        }

        // 没有之前的位置或者没重复就正常返回 OK 和更新之前位置
        this.memory.prePos = currentPos
        return OK
    }

    /**
     * 向指定方向发起对穿
     * @param direction
     * @returns
     */
    public mutualCross(direction: DirectionConstant): OK | ERR_BUSY | ERR_NOT_FOUND {
        // 获取前方位置上的 creep（fontCreep）
        const fontPos = this.pos.directionToPos(direction)
        if (!fontPos) return ERR_NOT_FOUND

        const fontCreep = fontPos.lookFor(LOOK_CREEPS)[0] || fontPos.lookFor(LOOK_POWER_CREEPS)[0]
        if (!fontCreep) return ERR_NOT_FOUND

        this.say(`👉`)
        // 如果前面的 creep 同意对穿了，自己就朝前移动
        if (fontCreep.requireCross(getOppositeDirection(direction))) {
            this.move(direction)
            return OK
        } else {
            return ERR_BUSY
        }
    }

    /**
     * 请求对穿
     * @param direction
     * @returns
     */
    public requireCross(direction: DirectionConstant): boolean {
        // this 下没有 memory 说明 creep 已经凉了，直接移动即可
        if (!this.memory) return true

        // 拒绝对穿
        if (this.memory.dontPullMe) {
            this.say('👊')
            return false
        }

        // 同意对穿
        this.say('👌')
        this.move(direction)
        return true
    }

    /**
     * boost
     * @param boostList
     */
    public goBoost(): boolean {
        let boostList = roleBoostConfig[this.memory.role]

        if (boostList == undefined || boostList.length == 0) return true
        const boostConfig = this.room.memory.roomLabConfig.singleLabConfig
        if (this.spawning) return false

        boostList = boostList.filter(boostType =>
            this.body.filter(body => body.type == boostBodyPart[boostType] && !body.boost).length > 0
        )

        if (boostList.length == 0) {
            this.memory.ready = true
            return true
        }

        for (let labId in boostConfig) {
            if (boostList.includes(boostConfig[labId].boostType)) {
                const boostLab: StructureLab = Game.getObjectById(labId) as StructureLab
                if (boostLab.mineralType == undefined || boostLab.store[boostLab.mineralType] < 100) {
                    this.moveTo(this.room.spawns[0])
                    return false
                }

                if (getDistance(this.pos, boostLab.pos) > 1) {
                    this.moveTo(boostLab)
                    return false
                } else {
                    boostLab.boostCreep(this)
                }
            }
        }
        return false
    }
}
