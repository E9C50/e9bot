export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return true
    },
    doWork: (creep: Creep) => {
        const creepData: FillerData = data as FillerData
        const sourceTarget = Game.getObjectById<Structure>(creepData.sourceId)

        if (!sourceTarget) {
            creep.say('❓')
            return
        }

        if (!creep.memory.working && creep.withdraw(sourceTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sourceTarget);
        }

        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true
        }

        const targets = [...creep.room.spawns, ...creep.room.extensions, ...(creep.room.storage ? [creep.room.storage] : [])]
            .filter(item => item.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
        const transferTarget = targets.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b))[0];

        if (creep.memory.working && creep.transfer(transferTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(transferTarget);
        }

        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false
        }
    },
})
