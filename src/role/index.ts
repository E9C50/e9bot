import AdvRoleManager from "./AdvRoleManager"
import BaseRoleBuilder from "./BaseRoleBuilder"
import BaseRoleFiller from "./BaseRoleFiller"
import BaseRoleHarvester from "./BaseRoleHarvester"
import BaseRoleMiner from "./BaseRoleMiner"
import BaseRoleRepairer from "./BaseRoleRepairer"
import BaseRoleUpgrader from "./BaseRoleUpgrader"

const notImplemented = function (data: CreepData): ICreepConfig {
    throw new Error("Function not implemented.")
}

const creepWork: CreepWork = {
    harvester: BaseRoleHarvester,
    filler: BaseRoleFiller,
    upgrader: BaseRoleUpgrader,
    builder: BaseRoleBuilder,
    repairer: BaseRoleRepairer,
    miner: BaseRoleMiner,
    manager: AdvRoleManager,
}

export default creepWork
