import BaseRoleUpgrader from "./BaseRoleUpgrader"

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return room.storage != undefined && room.storage.store[RESOURCE_ENERGY] > 50000
            && [...room.walls, ...room.ramparts].filter(structure => structure.hits / structure.hitsMax < 0.5).length > 0
    },
    doWork: (creep: Creep) => {
        const creepData: RepairerData = data as RepairerData
        const sourceTarget: Structure = Game.getObjectById(creepData.sourceId) as Structure

        if (!creep.memory.working && creep.withdraw(sourceTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sourceTarget);
        }

        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true
        }

        var repairTarget = Game.getObjectById<Structure>(creepData.repairTarget);
        if (!repairTarget || repairTarget.hits == repairTarget.hitsMax) {
            repairTarget = creep.room.structures
                .filter(structure => structure.hits < structure.hitsMax)
                .sort((a, b) => a.hits - b.hits)[0]

            if (repairTarget) creepData.repairTarget = repairTarget.id
        }

        if (!repairTarget) {
            BaseRoleUpgrader(creep.memory.data).doWork(creep)
            return
        }

        if (creep.memory.working && creep.repair(repairTarget) == ERR_NOT_IN_RANGE) {
            creep.moveTo(repairTarget);
        }

        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false
            creepData.repairTarget = ''
        }
    },
})
