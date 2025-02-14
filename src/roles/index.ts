import RoleBaseBuilder from "./Base/RoleBaseBuilder"
import RoleBaseFiller from "./Base/RoleBaseFiller"
import RoleBaseHarvester from "./Base/RoleBaseHarvester"
import RoleBaseUpgrade from "./Base/RoleBaseUpgrade"


const notImplemented = function (role: CreepRoleConstant, data: CreepData): ICreepConfig {
    return {
        exec: function (creep: Creep): void { },
        spawnCheck: function (room: Room, creepCount: number): CreepSpawnData | undefined { return undefined }
    }
}

const creepWork: CreepWork = {
    harvester: RoleBaseHarvester,
    filler: RoleBaseFiller,
    upgrader: RoleBaseUpgrade,
    builder: RoleBaseBuilder,
    repairer: notImplemented,
    miner: notImplemented,
    scout: notImplemented,
    manager: notImplemented,
    processer: notImplemented,
    claimer: notImplemented,
    reserver: notImplemented,
    rBuilder: notImplemented,
    rFiller: notImplemented,
    rHarvester: notImplemented,
    attacker: notImplemented,
    healer: notImplemented,
    rAttacker: notImplemented,
    dismantler: notImplemented,
    integrate: notImplemented,
    defender: notImplemented,
    rdefender: notImplemented,
    cAttacker: notImplemented
}

export default creepWork