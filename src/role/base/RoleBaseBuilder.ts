import BaseRoleRepairer from './RoleBaseRepairer'

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return room.constructionSites.length > 0
    },
    doWork: (creep: Creep) => {
        const creepData: BuilderData = data as BuilderData
        const sourceTarget: Structure = Game.getObjectById(creepData.sourceId) as Structure

        if (creepData.buildTarget != undefined) {
            if (Game.getObjectById(creepData.buildTarget) == undefined) {
                creep.room.memory['IDOF_STRUCTURE'] = []
                creep.room.memory['IDOF_CONSTRUCTION_SITE'] = []
                creep.room['_STRUCTURE'] = []
                creep.room['_CONSTRUCTION_SITE'] = []
                creepData.buildTarget = undefined
            }
        }

        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true
        }

        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false
        }

        if (!creep.memory.working && creep.withdraw(sourceTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sourceTarget);
        }

        const repairTargets: Structure[] = creep.room.structures.filter(structure =>
            structure.structureType == STRUCTURE_RAMPART && structure.hits < 5000
            && structure.pos.inRangeTo(creep.pos, 3)
        )
        if (repairTargets.length > 0) {
            creep.repair(repairTargets[0])
            return
        }

        const buildTargets: ConstructionSite[] = creep.room.constructionSites
        if (buildTargets.length == 0) {
            BaseRoleRepairer(creep.memory.data).doWork(creep)
            return
        }

        buildTargets.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b))
        creepData.buildTarget = buildTargets[0].id
        if (creep.memory.working && creep.build(buildTargets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(buildTargets[0]);
        }
    },
})
