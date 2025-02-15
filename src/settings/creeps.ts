const bodyList = (bodyType: BodyPartConstant, bodyCount: number) => Array.from({ length: bodyCount }, () => bodyType)
export const CreepRoleConfig: CreepRole = {
    /* 基本房间运营 */
    harvester: { roleCode: 'H', warMode: false, priority: 1 },
    upgrader: { roleCode: "U", warMode: false, priority: 3 },
    builder: { roleCode: "B", warMode: false, priority: 2 },
    repairer: { roleCode: "R", warMode: false, priority: 4 },
    filler: { roleCode: "F", warMode: false, priority: 2 },
    miner: { roleCode: "M", warMode: false, priority: 0 },
    scout: { roleCode: "S", warMode: false, priority: 0 },
    manager: { roleCode: "C", warMode: false, priority: 0 },
    processer: { roleCode: "P", warMode: false, priority: 0 },
    claimer: { roleCode: "CL", warMode: false, priority: 0 },
    reserver: { roleCode: "RE", warMode: false, priority: 0 },
    rHarvester: { roleCode: "RH", warMode: false, priority: 0 },
    rFiller: { roleCode: "RF", warMode: false, priority: 0 },
    rBuilder: { roleCode: "RB", warMode: false, priority: 0 },
    attacker: { roleCode: "ATT", warMode: false, priority: 0 },
    healer: { roleCode: "HEA", warMode: false, priority: 0 },
    rAttacker: { roleCode: "", warMode: false, priority: 0 },
    dismantler: { roleCode: "", warMode: false, priority: 0 },
    integrate: { roleCode: "", warMode: false, priority: 0 },
    defender: { roleCode: "", warMode: false, priority: 0 },
    rdefender: { roleCode: "", warMode: false, priority: 0 },
    cAttacker: { roleCode: "", warMode: false, priority: 0 },
}

export const workerBodyConfigs = {
    1: { [WORK]: 1, [CARRY]: 1, [MOVE]: 1 },
    2: { [WORK]: 2, [CARRY]: 2, [MOVE]: 2 },
    3: { [WORK]: 3, [CARRY]: 3, [MOVE]: 3 },
    4: { [WORK]: 4, [CARRY]: 4, [MOVE]: 4 },
    5: { [WORK]: 6, [CARRY]: 6, [MOVE]: 6 },
    6: { [WORK]: 7, [CARRY]: 7, [MOVE]: 7 },
    7: { [WORK]: 12, [CARRY]: 6, [MOVE]: 9 },
    8: { [WORK]: 20, [CARRY]: 10, [MOVE]: 20 }
}

export const carryBodyConfigs = {
    1: { [CARRY]: 2, [MOVE]: 2 },
    2: { [CARRY]: 3, [MOVE]: 3 },
    3: { [CARRY]: 4, [MOVE]: 2 },
    4: { [CARRY]: 5, [MOVE]: 3 },
    5: { [CARRY]: 8, [MOVE]: 4 },
    6: { [CARRY]: 14, [MOVE]: 7 },
    7: { [CARRY]: 20, [MOVE]: 10 },
    8: { [CARRY]: 33, [MOVE]: 17 }
}