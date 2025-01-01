import BaseRoleFiller from "./BaseRoleFiller"
import BaseRoleHarvester from "./BaseRoleHarvester"
import BaseRoleUpgrader from "./BaseRoleUpgrader"

const notImplemented = function (data: CreepData): ICreepConfig {
    throw new Error("Function not implemented.")
}

const creepWork: CreepWork = {
    harvester: BaseRoleHarvester,
    filler: BaseRoleFiller,
    upgrader: BaseRoleUpgrader,
    builder: notImplemented,
    repairer: notImplemented,
    miner: notImplemented,
    manager: notImplemented,
}

export default creepWork
