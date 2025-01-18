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
            if (enemyTarget == undefined) {
                creep.room.memory.enemyTarget = undefined
                return true
            }
            const closestRamOrWall = getClosestTarget(enemyTarget.pos, [...creep.room.ramparts, ...creep.room.walls])
            if (closestRamOrWall != undefined) {
                const result = creep.moveTo(closestRamOrWall.pos.x, closestRamOrWall.pos.y, {
                    costCallback: function (roomName, costMatrix) {
                        for (let i = 0; i < 2500 - 1; i++) {
                            const x = i % 50
                            const y = Math.floor(i / 50)
                            const cost = creep.room.memory.defenderCostMatrix[i]
                            costMatrix.set(x, y, cost)
                        }
                        creep.room.structures.forEach(structure => {
                            if (structure.structureType != STRUCTURE_ROAD
                                && structure.structureType != STRUCTURE_CONTAINER
                                && structure.structureType != STRUCTURE_RAMPART
                            ) costMatrix.set(structure.pos.x, structure.pos.y, 255)
                        })
                        const managerPos = creep.room.memory.roomPosition.managerPos
                        if (managerPos != undefined) {
                            costMatrix.set(managerPos.x, managerPos.y, 255)
                        }
                        return costMatrix
                    }
                })
            }
        }

        const findCreepsIn3 = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3)
        const findCreepsIn1 = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1)
        if (findCreepsIn3.length > 0) {
            creep.rangedAttack(findCreepsIn3[0])
        }
        if (findCreepsIn1.length > 0) {
            creep.rangedMassAttack()
        }
        return true
    },
})
