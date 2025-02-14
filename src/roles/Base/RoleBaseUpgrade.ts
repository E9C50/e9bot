export default (role: CreepRoleConstant, data: CreepData): ICreepConfig => ({
    spawnCheck: function (room: Room, creepCount: number): CreepSpawnData | undefined {
        if (creepCount < 1 && (room.level < 8 || room.controller != undefined && room.controller.ticksToDowngrade < 150000)) {
            return { creepRole: role, creepData: {} }
        }
        return undefined
    },
    exec: function (creep: Creep): void {
        if (creep.memory.working) {
            creep.doUpdateWork()
        } else {
            creep.takeEnergy()
        }
    },
})