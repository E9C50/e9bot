import { carryBodyConfigs } from "settings/creeps"

export default (role: CreepRoleConstant, data: CreepData): ICreepConfig => ({
    spawnCheck: function (room: Room, creepCount: number): CreepSpawnData | undefined {
        if (creepCount < 1) {
            return { creepRole: role, creepData: {}, bodyPart: [CARRY, CARRY, MOVE, MOVE] }
        }
        return undefined
    },
    exec: function (creep: Creep): void {
    }
})