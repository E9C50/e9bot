export default (role: CreepRoleConstant, data: CreepData): ICreepConfig => ({
    spawnCheck: function (room: Room, creepCount: number): CreepSpawnData | undefined {
        if (creepCount < 1 && room.constructionSite.length > 0) {
            return { creepRole: role, creepData: {} }
        }
        return undefined
    },
    exec: function (creep: Creep): void {
        if (creep.memory.working) {
            creep.doBuildWork()
        } else {
            creep.takeEnergy()
        }
    },
})