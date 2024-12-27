declare type CreepRoleConstant = roleBaseEnum | roleAdvEnum | roleWarEnum

declare enum roleBaseEnum {
    HARVESTER = 'harvester',
    FILLER = 'filler',
    UPGRADER = 'upgrader',
    BUILDER = 'builder',
    REPAIRER = 'repairer',
    MINER = 'miner',
}

declare enum roleAdvEnum {
    MANAGER = "manager",
    CLAIMER = "claimer",
    RESERVER = "reserver",
    RHARVESTER = "remoteHarvester",
    RFILLER = "remoteFiller",
}

declare enum roleWarEnum {
    SOLDIER = "soldier",
    DOCTOR = "doctor",
    DISMANTLER = "dismantler",
    DEFENDER = "defender",
    ALLINONE = "allinone",
}

declare enum colorEnum {
    RED = '#ef9a9a',
    GREEN = '#6b9955',
    YELLOW = '#c5c599',
    BLUE = '#8dc5e3'
}


interface Creep {
    buildStructure(): ScreepsReturnCode
    upgradeController(): ScreepsReturnCode

    getEnergyFrom(target: Structure | Source): ScreepsReturnCode
    transferTo(target: Structure, resourceType: ResourceConstant): ScreepsReturnCode
}

interface Room {
    my: boolean
    level: number

    creepConfig: { [creepName: string]: CreepMemory }

    // 建筑缓存一键访问
    mineral: Mineral
    sources: Source[]

    structures: Structure[]
    constructionSites: ConstructionSite[]

    roads: StructureRoad[]
    spawns: StructureSpawn[]
    ramparts: StructureRampart[]
    extensions: StructureExtension[]
    walls: StructureWall[]

    labs: StructureLab[]
    links: StructureLink[]
    towers: StructureTower[]
    containers: StructureContainer[]

    keeperLairs: StructureKeeperLair[]
    powerBanks: StructurePowerBank[]
    portals: StructurePortal[]

    nuker?: StructureNuker
    factory?: StructureFactory
    observer?: StructureObserver
    extractor?: StructureExtractor
    powerSpawn?: StructurePowerSpawn
    invaderCore?: StructureInvaderCore
    // storage: StructureStorage
    // terminal: StructureTerminal
    // controller: StructureController

    centerLink?: StructureLink
    controllerLink?: StructureLink
}

interface Source {
    freeSpaceCount: number
}

interface Mineral {
    freeSpaceCount: number
}

interface RoomMemory {
    infoPos?: RoomPosition
    managerPos?: RoomPosition
    centerPos?: RoomPosition

    autoLaylout?: boolean

    freeSpaceCount: { [sourceId: string]: number }
    creepConfig: { [creepName: string]: CreepMemory }
}

interface CreepMemory {
    role: CreepRoleConstant
    ready: boolean
    working: boolean
    spawnRoom: string
    data: CreepData
}

/**
 * 所有 creep 角色的 data
 */
type CreepData = EmptyData | HarvesterData | WorkerData

/**
 * 有些角色不需要 data
 */
interface EmptyData { }

/**
 * 采集单位的 data
 * 执行从 sourceId 处采集东西，并转移至 targetId 处（不一定使用，每个角色都有自己固定的目标例如 storage 或者 terminal）
 */
interface HarvesterData {
    // 要采集的 source id
    sourceId: string
    // 把采集到的资源存到哪里存在哪里
    targetId: string
}

/**
 * 工作单位的 data
 * 由于由确定的工作目标所以不需要 targetId
 */
interface WorkerData {
    // 要使用的资源存放建筑 id
    sourceId: string
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
