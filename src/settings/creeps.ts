const bodyList = (bodyType: BodyPartConstant, bodyCount: number) => Array.from({ length: bodyCount }, () => bodyType)
export const CreepRoleConfig: CreepRole = {
    /* 基本房间运营 */
    harvester: { roleCode: 'H', warMode: false, priority: 3, bodyPart: [...bodyList(MOVE, 2), ...bodyList(WORK, 2)] },
    filler: { roleCode: "", warMode: false, priority: 0, bodyPart: [], boostMap: undefined },
    upgrader: { roleCode: "", warMode: false, priority: 0, bodyPart: [], boostMap: undefined },
    builder: { roleCode: "", warMode: false, priority: 0, bodyPart: [], boostMap: undefined },
    repairer: { roleCode: "", warMode: false, priority: 0, bodyPart: [], boostMap: undefined },
    miner: { roleCode: "", warMode: false, priority: 0, bodyPart: [], boostMap: undefined },
    scout: { roleCode: "", warMode: false, priority: 0, bodyPart: [], boostMap: undefined },
    manager: { roleCode: "", warMode: false, priority: 0, bodyPart: [], boostMap: undefined },
    processer: { roleCode: "", warMode: false, priority: 0, bodyPart: [], boostMap: undefined },
    claimer: { roleCode: "", warMode: false, priority: 0, bodyPart: [], boostMap: undefined },
    reserver: { roleCode: "", warMode: false, priority: 0, bodyPart: [], boostMap: undefined },
    rHarvester: { roleCode: "", warMode: false, priority: 0, bodyPart: [], boostMap: undefined },
    rFiller: { roleCode: "", warMode: false, priority: 0, bodyPart: [], boostMap: undefined },
    rBuilder: { roleCode: "", warMode: false, priority: 0, bodyPart: [], boostMap: undefined },
    attacker: { roleCode: "", warMode: false, priority: 0, bodyPart: [], boostMap: undefined },
    healer: { roleCode: "", warMode: false, priority: 0, bodyPart: [], boostMap: undefined },
    rAttacker: { roleCode: "", warMode: false, priority: 0, bodyPart: [], boostMap: undefined },
    dismantler: { roleCode: "", warMode: false, priority: 0, bodyPart: [], boostMap: undefined },
    integrate: { roleCode: "", warMode: false, priority: 0, bodyPart: [], boostMap: undefined },
    defender: { roleCode: "", warMode: false, priority: 0, bodyPart: [], boostMap: undefined },
    rdefender: { roleCode: "", warMode: false, priority: 0, bodyPart: [], boostMap: undefined },
    cAttacker: { roleCode: "", warMode: false, priority: 0, bodyPart: [], boostMap: undefined },
}

export const CreepSpawnCheck: CreepCheck = {
    harvester: function (creep: Creep): boolean {
        throw new Error("Function not implemented.")
    },
    filler: function (creep: Creep): boolean {
        throw new Error("Function not implemented.")
    },
    upgrader: function (creep: Creep): boolean {
        throw new Error("Function not implemented.")
    },
    builder: function (creep: Creep): boolean {
        throw new Error("Function not implemented.")
    },
    repairer: function (creep: Creep): boolean {
        throw new Error("Function not implemented.")
    },
    miner: function (creep: Creep): boolean {
        throw new Error("Function not implemented.")
    },
    scout: function (creep: Creep): boolean {
        throw new Error("Function not implemented.")
    },
    manager: function (creep: Creep): boolean {
        throw new Error("Function not implemented.")
    },
    processer: function (creep: Creep): boolean {
        throw new Error("Function not implemented.")
    },
    claimer: function (creep: Creep): boolean {
        throw new Error("Function not implemented.")
    },
    reserver: function (creep: Creep): boolean {
        throw new Error("Function not implemented.")
    },
    rBuilder: function (creep: Creep): boolean {
        throw new Error("Function not implemented.")
    },
    rFiller: function (creep: Creep): boolean {
        throw new Error("Function not implemented.")
    },
    rHarvester: function (creep: Creep): boolean {
        throw new Error("Function not implemented.")
    },
    attacker: function (creep: Creep): boolean {
        throw new Error("Function not implemented.")
    },
    healer: function (creep: Creep): boolean {
        throw new Error("Function not implemented.")
    },
    rAttacker: function (creep: Creep): boolean {
        throw new Error("Function not implemented.")
    },
    dismantler: function (creep: Creep): boolean {
        throw new Error("Function not implemented.")
    },
    integrate: function (creep: Creep): boolean {
        throw new Error("Function not implemented.")
    },
    defender: function (creep: Creep): boolean {
        throw new Error("Function not implemented.")
    },
    rdefender: function (creep: Creep): boolean {
        throw new Error("Function not implemented.")
    },
    cAttacker: function (creep: Creep): boolean {
        throw new Error("Function not implemented.")
    }
}