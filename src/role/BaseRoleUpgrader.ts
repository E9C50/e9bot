export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return true
    },
    doWork: (creep: Creep) => {
        const creepData: FillerData = data as FillerData
        const sourceTarget: Structure = Game.getObjectById(creepData.sourceId) as Structure

        if (!creep.memory.working && creep.withdraw(sourceTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sourceTarget);
        }

        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true
        }

        if (!creep.room.controller) return

        if (creep.memory.working && creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }

        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false
        }
    },
})
