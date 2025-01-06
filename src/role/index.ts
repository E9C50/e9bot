import RoleAdvManager from "./adv/RoleAdvManager"
import RoleAdvProcesser from "./adv/RoleAdvProcesser"
import RoleAdvRemoteFiller from "./adv/RoleAdvRemoteFiller"
import RoleAdvRemoteHarvester from "./adv/RoleAdvRemoteHarvester"
import RoleAdvReserver from "./adv/RoleAdvReserver"
import RoleBaseBuilder from "./base/RoleBaseBuilder"
import RoleBaseFiller from "./base/RoleBaseFiller"
import RoleBaseHarvester from "./base/RoleBaseHarvester"
import RoleBaseMiner from "./base/RoleBaseMiner"
import RoleBaseRepairer from "./base/RoleBaseRepairer"
import RoleBaseUpgrader from "./base/RoleBaseUpgrader"
import RoleWarAttacker from "./war/RoleWarAttacker"
import RoleWarIntegrate from "./war/RoleWarIntegrate"

const notImplemented = function (data: CreepData): ICreepConfig {
    throw new Error("Function not implemented.")
}

const creepWork: CreepWork = {
    harvester: RoleBaseHarvester,
    filler: RoleBaseFiller,
    upgrader: RoleBaseUpgrader,
    builder: RoleBaseBuilder,
    repairer: RoleBaseRepairer,
    miner: RoleBaseMiner,

    manager: RoleAdvManager,
    processer: RoleAdvProcesser,
    claimer: notImplemented,
    reserver: RoleAdvReserver,
    rHarvester: RoleAdvRemoteHarvester,
    rFiller: RoleAdvRemoteFiller,

    attacker: RoleWarAttacker,
    healer: notImplemented,
    rAttacker: notImplemented,
    dismantler: notImplemented,
    integrate: RoleWarIntegrate,
}

export default creepWork
