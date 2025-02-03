import { getClosestLineTarget, getClosestTarget } from "utils"

function callTower(target: Creep) {
    if (target.my && target.hits < target.hitsMax) {
        target.room.towers[0].heal(target)
        return
    }
    if (target.room.towers.filter(tower => tower.store[RESOURCE_ENERGY] > 0).length == target.room.towers.length) {
        target.room.towers.forEach(tower => {
            tower.attack(target)
        })
    }
}

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
        const creepData: DefenderData = data as DefenderData
        let enemyTargetId: string = creepData.targetEnemy

        if (creep.hits < creep.hitsMax) {
            callTower(creep)
        }

        if (enemyTargetId != undefined) {
            let enemyTarget = Game.getObjectById(enemyTargetId) as Creep
            if (enemyTarget == undefined) {
                enemyTarget = creep.room.enemies[Math.floor(Math.random() * creep.room.enemies.length)]
            }

            if (enemyTarget == undefined) return true

            const closestRamOrWall = getClosestLineTarget(enemyTarget.pos, [...creep.room.ramparts, ...creep.room.walls])
            if (closestRamOrWall != undefined) {
                const result = creep.moveTo(closestRamOrWall.pos.x, closestRamOrWall.pos.y, {
                    costCallback: function (roomName, costMatrix) {
                        const defenderCostMatrix = creep.room.getDefenderCostMatrix()
                        for (let i = 0; i < 2500 - 1; i++) {
                            const x = i % 50
                            const y = Math.floor(i / 50)
                            const cost = defenderCostMatrix[i]
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
