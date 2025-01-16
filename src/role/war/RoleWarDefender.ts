import { getClosestTarget, getDistance } from "utils"

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return true
    },
    prepare(creep) {
        creep.memory.needBoost = true
        if (creep.memory.needBoost) {
            // 处理boost
            const boostConfig = creep.room.memory.roomLabConfig.singleLabConfig
            for (let index in creep.body) {
                const bodyPart = creep.body[index]
                if (bodyPart.boost == undefined) {
                    for (let labId in boostConfig) {
                        if (boostConfig[labId].boostPart == bodyPart.type) {
                            const boostLab: StructureLab = Game.getObjectById(labId) as StructureLab
                            if (boostLab.mineralType == undefined || boostLab.store[boostLab.mineralType] < 100) {
                                creep.moveTo(creep.room.spawns[0])
                                return false
                            }
                            if (getDistance(creep.pos, boostLab.pos) > 1) {
                                creep.moveTo(boostLab)
                                return false
                            }
                        }
                    }
                    return false
                }
            }
            return true
        }
        return true
    },
    source(creep) {
        creep.memory.working = true
        return true
    },
    target(creep) {
        if (creep.room.memory.enemyTarget != undefined) {
            const enemyTarget = Game.getObjectById(creep.room.memory.enemyTarget) as Creep
            if (enemyTarget == undefined) return true
            const closestRamOrWall = getClosestTarget(enemyTarget.pos, [...creep.room.ramparts, ...creep.room.walls])
            if (closestRamOrWall != undefined) {
                creep.moveTo(closestRamOrWall.pos.x, closestRamOrWall.pos.y, {
                    avoid: creep.room.structures,
                    costCallback: function (roomName, costMatrix) {
                        for (let i = 0; i < 2500 - 1; i++) {
                            const x = i % 50
                            const y = Math.floor(i / 50)
                            const cost = creep.room.memory.defenderCostMatrix[i]
                            costMatrix.set(x, y, cost)
                        }
                        return costMatrix
                    }
                })
            }
        }

        const findCreeps = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1)
        if (findCreeps.length > 0) {
            creep.attack(findCreeps[0])
        }
        return true
    },
})
