import { getClosestLineTarget } from "utils"

function callTower(target: Creep) {
    if (target.my && target.hits < target.hitsMax && Game.time % 10 == 0) {
        target.room.towers.forEach(tower => {
            tower.heal(target)
        })
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

        if (enemyTargetId != undefined) {
            let enemyTarget = Game.getObjectById(enemyTargetId) as Creep
            if (enemyTarget == undefined) {
                enemyTarget = creep.room.enemies[Math.floor(Math.random() * creep.room.enemies.length)]
            }

            if (enemyTarget == undefined) return true

            const defenderCostMatrix = creep.room.getDefenderCostMatrix()

            const closestRamOrWall = getClosestLineTarget(enemyTarget.pos, [...creep.room.ramparts, ...creep.room.walls])
            if (closestRamOrWall != undefined && defenderCostMatrix.get(closestRamOrWall.pos.x, closestRamOrWall.pos.y) != 255) {
                const result = creep.moveTo(closestRamOrWall.pos.x, closestRamOrWall.pos.y, {
                    costCallback: function (roomName, costMatrix) {
                        costMatrix = defenderCostMatrix
                        const managerPos = creep.room.memory.roomPosition.managerPos
                        if (managerPos != undefined) {
                            costMatrix.set(managerPos.x, managerPos.y, 255)
                        }
                        return costMatrix
                    }
                })
            }
        }

        const creepInRam = creep.pos.lookFor(LOOK_STRUCTURES).filter(stru => stru.structureType == STRUCTURE_RAMPART).length > 0

        if (creepInRam && creep.hits < creep.hitsMax) {
            callTower(creep)
        }

        const findCreepsIn1 = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1).sort((a, b) => a.hits - b.hits)
        if (findCreepsIn1.length > 0) {
            creep.rangedMassAttack()
            const target = findCreepsIn1[0]
            callTower(target)
            creepData.lastEnemy = target.id
            if (creep.hits == creep.hitsMax && creepInRam) {
                creep.move(creep.pos.getDirectionTo(target))
            }
            return true
        }

        const findCreepsIn3 = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3).sort((a, b) => a.hits - b.hits)
        if (findCreepsIn3.length > 0) {
            const target = findCreepsIn3[0]
            creep.rangedAttack(target)
            callTower(target)
            creepData.lastEnemy = target.id
            return true
        }

        const findCreepsIn5 = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 5)
            .filter(creep => creep.hits < creep.hitsMax).sort((a, b) => a.hits - b.hits)
        if (findCreepsIn5.length > 0) {
            const target = findCreepsIn5[0]
            if (target) callTower(target)
        }

        return true
    },
})
