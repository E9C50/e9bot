import BaseRoleRepairer from './BaseRoleRepairer'

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return room.constructionSites.length > 0
    },
    doWork: (creep: Creep) => {
        if (creep.pickupDroppedResource(false, 1)) return

        const creepData: BuilderData = data as BuilderData
        const sourceTarget: Structure = Game.getObjectById(creepData.sourceId) as Structure

        if (!creep.memory.working && creep.withdraw(sourceTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sourceTarget);
        }

        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true
        }

        const targets = creep.room.constructionSites
        if (targets.length == 0) {
            BaseRoleRepairer(creep.memory.data).doWork(creep)
            return
        }

        targets.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b))
        if (creep.memory.working && creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
        }

        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false
        }

        if (creep.memory.working) {
            creep.say('🪛')
        } else {
            creep.say('🈳')
        }
    },
})
