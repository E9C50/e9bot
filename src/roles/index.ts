import RoleBaseHarvester from "./Base/RoleBaseHarvester"

const notImplemented: ICreepConfig = { exec(creep) { throw new Error("Function not implemented.") } }

const creepWork: CreepWork = {
    harvester: RoleBaseHarvester,
    filler: notImplemented,
    upgrader: notImplemented,
    builder: notImplemented,
    repairer: notImplemented,
    miner: notImplemented,
    scout: notImplemented,

    manager: notImplemented,
    processer: notImplemented,
    claimer: notImplemented,
    reserver: notImplemented,
    rHarvester: notImplemented,
    rFiller: notImplemented,
    rBuilder: notImplemented,

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