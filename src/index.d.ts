interface Creep {
    buildStructure(): ScreepsReturnCode
    upgradeController(): ScreepsReturnCode

    getEnergyFrom(target: Structure | Source): ScreepsReturnCode
    transferTo(target: Structure, resourceType: ResourceConstant): ScreepsReturnCode
}

interface Room {
    // 建筑缓存一键访问
    mineral: Mineral
    sources: Source[]

    structures: Structure[]
    constructionSites: ConstructionSite[]

    roads: StructureRoad[]
    spawns: StructureSpawn[]
    ramparts: StructureRampart[]
    extensions: StructureExtension[]
    constructedWalls: StructureWall[]

    labs: StructureLab[]
    links: StructureLink[]
    towers: StructureTower[]
    containers: StructureContainer[]

    keeperLairs: StructureKeeperLair[]
    powerBanks: StructurePowerBank[]
    portals: StructurePortal[]

    nuker: StructureNuker
    factory: StructureFactory
    observer: StructureObserver
    extractor: StructureExtractor
    powerSpawn: StructurePowerSpawn
    invaderCore: StructureInvaderCore
    // storage: StructureStorage
    // terminal: StructureTerminal
    // controller: StructureController

    centerLink: StructureLink
    controllerLink: StructureLink
}

interface RoomMemory {
    infoPos: RoomPosition
    managerPos: RoomPosition
    centerPos: RoomPosition

    autoLaylout: boolean
}

interface BodySet {
    [MOVE]?: number
    [CARRY]?: number
    [ATTACK]?: number
    [RANGED_ATTACK]?: number
    [WORK]?: number
    [CLAIM]?: number
    [TOUGH]?: number
    [HEAL]?: number
}
