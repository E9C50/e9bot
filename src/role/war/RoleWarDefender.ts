import { getClosestTarget } from "utils"

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return true
    },
    prepare(creep) {
        creep.memory.needBoost = true
        if (!creep.memory.ready && creep.memory.needBoost) {
            return creep.goBoost()
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

        const findCreeps = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1)
        if (findCreeps.length > 0) {
            creep.attack(findCreeps[0])
        }
        return true
    },
})
