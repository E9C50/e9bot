export default (role: CreepRoleConstant, data: CreepData): ICreepConfig => ({
    spawnCheck: function (room: Room, creepCount: number): CreepSpawnData | undefined {
        if (creepCount < 1) {
            return { creepRole: role, creepData: {} }
        }
        return undefined
    },
    exec: function (creep: Creep): void {
    }
})