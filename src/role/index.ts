import RoleAdvClaimer from "./adv/RoleAdvClaimer"
import RoleAdvManager from "./adv/RoleAdvManager"
import RoleAdvProcesser from "./adv/RoleAdvProcesser"
import RoleAdvRemoteBuilder from "./adv/RoleAdvRemoteBuilder"
import RoleAdvRemoteFiller from "./adv/RoleAdvRemoteFiller"
import RoleAdvRemoteHarvester from "./adv/RoleAdvRemoteHarvester"
import RoleAdvReserver from "./adv/RoleAdvReserver"
import RoleBaseBuilder from "./base/RoleBaseBuilder"
import RoleBaseFiller from "./base/RoleBaseFiller"
import RoleBaseHarvester from "./base/RoleBaseHarvester"
import RoleBaseMiner from "./base/RoleBaseMiner"
import RoleBaseRepairer from "./base/RoleBaseRepairer"
import RoleBaseScout from "./base/RoleBaseScout"
import RoleBaseUpgrader from "./base/RoleBaseUpgrader"
import RoleWarAttacker from "./war/RoleWarAttacker"
import RoleWarDefender from "./war/RoleWarDefender"
import RoleWarDefenderRanged from "./war/RoleWarDefenderRanged"
import RoleWarHealer from "./war/RoleWarHealer"
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
    scout: RoleBaseScout,

    manager: RoleAdvManager,
    processer: RoleAdvProcesser,
    claimer: RoleAdvClaimer,
    reserver: RoleAdvReserver,
    rHarvester: RoleAdvRemoteHarvester,
    rFiller: RoleAdvRemoteFiller,
    rBuilder: RoleAdvRemoteBuilder,

    attacker: RoleWarAttacker,
    healer: RoleWarHealer,
    rAttacker: notImplemented,
    dismantler: notImplemented,
    integrate: RoleWarIntegrate,
    defender: RoleWarDefender,
    rdefender: RoleWarDefenderRanged,
}

export default creepWork
