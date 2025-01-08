
export const STRUCTURE_PRIVATEKEY_PERFIX = '_'
export const STRUCTURE_MEMORYKEY_PERFIX = 'IDOF_'

export const defaultReserverSign = 'Reserved by E9C50.'
export const defaultConrtollerSign = 'Controlled by E9C50.'

export enum roleBaseEnum {
    HARVESTER = 'harvester',
    FILLER = 'filler',
    UPGRADER = 'upgrader',
    BUILDER = 'builder',
    REPAIRER = 'repairer',
    MINER = 'miner',
}

export enum roleAdvEnum {
    MANAGER = "manager",
    PROCESSER = "processer",
    CLAIMER = "claimer",
    RESERVER = "reserver",
    RHARVESTER = "rHarvester",
    RFILLER = "rFiller",
    RBUILDER = "rBuilder",
}

export enum roleWarEnum {
    ATTACKER = 'attacker',
    HEALER = 'healer',
    RANGED_ATTACKER = 'rAttacker',
    DISMANTLER = 'dismantler',
    INTEGRATE = 'integrate',
}

export enum colorEnum {
    RED = '#ef9a9a',
    GREEN = '#6b9955',
    YELLOW = '#c5c599',
    BLUE = '#8dc5e3'
}

// TODO 重新配置！！！
const workerBodyConfigs = [
    { [WORK]: 1, [CARRY]: 1, [MOVE]: 1 },
    { [WORK]: 2, [CARRY]: 2, [MOVE]: 2 },
    { [WORK]: 3, [CARRY]: 3, [MOVE]: 3 },
    { [WORK]: 4, [CARRY]: 4, [MOVE]: 4 },
    { [WORK]: 6, [CARRY]: 6, [MOVE]: 6 },
    { [WORK]: 7, [CARRY]: 7, [MOVE]: 7 },
    { [WORK]: 12, [CARRY]: 6, [MOVE]: 9 },
    { [WORK]: 20, [CARRY]: 8, [MOVE]: 14 }
]

const carryBodyConfigs = [
    { [CARRY]: 2, [MOVE]: 2 },
    { [CARRY]: 3, [MOVE]: 3 },
    { [CARRY]: 4, [MOVE]: 2 },
    { [CARRY]: 5, [MOVE]: 3 },
    { [CARRY]: 8, [MOVE]: 4 },
    { [CARRY]: 14, [MOVE]: 7 },
    { [CARRY]: 20, [MOVE]: 10 },
    { [CARRY]: 32, [MOVE]: 16 }
]

export const bodyConfigs: { [role in CreepRoleConstant]: BodySet[] } = {
    upgrader: workerBodyConfigs,
    builder: workerBodyConfigs,
    repairer: workerBodyConfigs,
    miner: workerBodyConfigs,
    filler: carryBodyConfigs,
    processer: carryBodyConfigs,
    rFiller: carryBodyConfigs,
    harvester: [
        { [WORK]: 2, [CARRY]: 1, [MOVE]: 1 },
        { [WORK]: 4, [CARRY]: 1, [MOVE]: 2 },
        { [WORK]: 6, [CARRY]: 1, [MOVE]: 3 },
        { [WORK]: 7, [CARRY]: 1, [MOVE]: 4 },
        { [WORK]: 8, [CARRY]: 1, [MOVE]: 5 },
        { [WORK]: 8, [CARRY]: 1, [MOVE]: 5 },
        { [WORK]: 8, [CARRY]: 1, [MOVE]: 5 },
        { [WORK]: 8, [CARRY]: 1, [MOVE]: 5 },
    ],
    manager: [
        { [CARRY]: 2, [MOVE]: 1 },
        { [CARRY]: 3, [MOVE]: 1 },
        { [CARRY]: 5, [MOVE]: 1 },
        { [CARRY]: 7, [MOVE]: 1 },
        { [CARRY]: 11, [MOVE]: 1 },
        { [CARRY]: 14, [MOVE]: 1 },
        { [CARRY]: 26, [MOVE]: 1 },
        { [CARRY]: 39, [MOVE]: 1 }
    ],
    claimer: [
        { [WORK]: 1, [CLAIM]: 1, [CARRY]: 1, [MOVE]: 3, },
        { [WORK]: 1, [CLAIM]: 1, [CARRY]: 1, [MOVE]: 3, },
        { [WORK]: 1, [CLAIM]: 1, [CARRY]: 1, [MOVE]: 3, },
        { [WORK]: 2, [CLAIM]: 1, [CARRY]: 3, [MOVE]: 6, },
        { [WORK]: 5, [CLAIM]: 1, [CARRY]: 4, [MOVE]: 10, },
        { [WORK]: 7, [CLAIM]: 1, [CARRY]: 6, [MOVE]: 14, },
        { [WORK]: 15, [CLAIM]: 1, [CARRY]: 9, [MOVE]: 25, },
        { [WORK]: 15, [CLAIM]: 1, [CARRY]: 9, [MOVE]: 25, }
    ],
    reserver: [
        { [MOVE]: 1, [CLAIM]: 1 },
        { [MOVE]: 1, [CLAIM]: 1 },
        { [MOVE]: 1, [CLAIM]: 1 },
        { [MOVE]: 1, [CLAIM]: 1 },
        { [MOVE]: 2, [CLAIM]: 2 },
        { [MOVE]: 2, [CLAIM]: 2 },
        { [MOVE]: 3, [CLAIM]: 3 },
        { [MOVE]: 5, [CLAIM]: 5 }
    ],
    rHarvester: [
        { [WORK]: 2, [CARRY]: 1, [MOVE]: 1 },
        { [WORK]: 4, [CARRY]: 1, [MOVE]: 2 },
        { [WORK]: 6, [CARRY]: 1, [MOVE]: 3 },
        { [WORK]: 7, [CARRY]: 1, [MOVE]: 4 },
        { [WORK]: 8, [CARRY]: 1, [MOVE]: 5 },
        { [WORK]: 8, [CARRY]: 1, [MOVE]: 5 },
        { [WORK]: 8, [CARRY]: 1, [MOVE]: 5 },
        { [WORK]: 8, [CARRY]: 1, [MOVE]: 5 },
    ],
    rBuilder: [
        { [WORK]: 15, [CARRY]: 10, [MOVE]: 25, },
        { [WORK]: 15, [CARRY]: 10, [MOVE]: 25, },
        { [WORK]: 15, [CARRY]: 10, [MOVE]: 25, },
        { [WORK]: 15, [CARRY]: 10, [MOVE]: 25, },
        { [WORK]: 15, [CARRY]: 10, [MOVE]: 25, },
        { [WORK]: 15, [CARRY]: 10, [MOVE]: 25, },
        { [WORK]: 15, [CARRY]: 10, [MOVE]: 25, },
        { [WORK]: 15, [CARRY]: 10, [MOVE]: 25, }
    ],
    attacker: [
        { [MOVE]: 2, [ATTACK]: 2 },
        { [MOVE]: 3, [ATTACK]: 3 },
        { [MOVE]: 4, [ATTACK]: 4 },
        { [MOVE]: 5, [ATTACK]: 5 },
        { [MOVE]: 6, [ATTACK]: 6 },
        { [MOVE]: 7, [ATTACK]: 7 },
        { [MOVE]: 8, [ATTACK]: 8 },
        { [MOVE]: 25, [ATTACK]: 25 }
    ],
    integrate: [
        { [TOUGH]: 0, [RANGED_ATTACK]: 15, [MOVE]: 6, [HEAL]: 3 },
        { [TOUGH]: 0, [RANGED_ATTACK]: 15, [MOVE]: 6, [HEAL]: 3 },
        { [TOUGH]: 2, [RANGED_ATTACK]: 15, [MOVE]: 6, [HEAL]: 5 },
        { [TOUGH]: 4, [RANGED_ATTACK]: 20, [MOVE]: 9, [HEAL]: 9 },
        { [TOUGH]: 6, [RANGED_ATTACK]: 21, [MOVE]: 10, [HEAL]: 13 },
        { [TOUGH]: 8, [RANGED_ATTACK]: 15, [MOVE]: 10, [HEAL]: 17 },
        { [TOUGH]: 10, [RANGED_ATTACK]: 9, [MOVE]: 10, [HEAL]: 21 },
        { [TOUGH]: 12, [RANGED_ATTACK]: 5, [MOVE]: 10, [HEAL]: 23 }
    ],
    healer: [
        { [MOVE]: 2, [HEAL]: 2 },
        { [MOVE]: 3, [HEAL]: 3 },
        { [MOVE]: 4, [HEAL]: 4 },
        { [MOVE]: 5, [HEAL]: 5 },
        { [MOVE]: 6, [HEAL]: 6 },
        { [MOVE]: 7, [HEAL]: 7 },
        { [MOVE]: 8, [HEAL]: 8 },
        { [MOVE]: 25, [HEAL]: 25 }],
    rAttacker: [],
    dismantler: [],
}

export const baseLayout: { [level: number]: {} } = {
    1: {
        [STRUCTURE_ROAD]: [
            [3, 0], [2, 1], [1, 2], [0, 3], [-1, 2], [-2, 1], [-3, 0], [-2, -1], [-1, -2], [0, -3], [1, -2], [2, -1],
            [0, -4], [0, -5], [-1, -6], [-2, -6], [-3, -6], [-4, -6], [-5, -5], [-4, -4], [-3, -3], [-2, -2],
            [-6, -4], [-6, -3], [-6, -2], [-6, -1], [-5, 0], [-4, 0], [-6, 1], [-6, 2], [-6, 3], [-6, 4],
            [-5, 5], [-4, 4], [-3, 3], [-2, 2], [-4, 6], [-3, 6], [-2, 6], [-1, 6], [0, 5], [0, 4],
            [1, 6], [2, 6], [3, 6], [4, 6], [1, -6], [2, -6], [3, -6], [4, -6],
            [5, 5], [5, -5], [4, 4], [4, -4], [3, 3], [3, -3], [2, 2], [2, -2], [4, 0], [5, 0],
            [6, 1], [6, 2], [6, 3], [6, 4], [6, -1], [6, -2], [6, -3], [6, -4]
        ]
    },
    2: {
        [STRUCTURE_EXTENSION]: [[-1, -3], [-2, -3], [-1, -4], [-2, -4], [-3, -4]],
    },
    3: {
        [STRUCTURE_EXTENSION]: [[1, -3], [2, -3], [1, -4], [2, -4], [3, -4]],
        [STRUCTURE_TOWER]: [[0, -6]],
    },
    4: {
        [STRUCTURE_EXTENSION]: [[1, -5], [2, -5], [3, -5], [4, -5], [-1, -5], [-2, -5], [-3, -5], [-4, -5], [5, -4], [-5, -4]],
        [STRUCTURE_STORAGE]: [[0, 1]],
    },
    5: {
        [STRUCTURE_EXTENSION]: [[-3, -1], [-4, -1], [-5, -1], [-4, -2], [-5, -2], [-4, -3], [-5, -3], [-3, 1], [-4, 1], [-5, 1]],
        // [STRUCTURE_RAMPART]: [
        //     [6, 1], [6, 2], [6, 3], [6, 4], [6, 0], [6, -1], [6, -2], [6, -3], [6, -4],
        //     [1, 6], [2, 6], [3, 6], [4, 6], [0, 6], [-1, 6], [-2, 6], [-3, 6], [-4, 6],

        //     [1, -6], [2, -6], [3, -6], [4, -6], [0, -6], [-1, -6], [-2, -6], [-3, -6], [-4, -6],
        //     [-6, 1], [-6, 2], [-6, 3], [-6, 4], [-6, 0], [-6, -1], [-6, -2], [-6, -3], [-6, -4],
        //     [5, 5], [5, -5], [-5, 5], [-5, -5],
        // ],
        [STRUCTURE_TOWER]: [[-3, -2]],
        [STRUCTURE_LINK]: [[0, -1]],
    },
    6: {
        [STRUCTURE_EXTENSION]: [[3, -1], [4, -1], [5, -1], [3, -2], [4, -2], [5, -2], [4, -3], [5, -3], [4, 1], [5, 1]],
        // [STRUCTURE_RAMPART]: [
        //     [5, 1], [5, 2], [5, 3], [5, 4], [5, 0], [5, -1], [5, -2], [5, -3], [5, -4],
        //     [1, 5], [2, 5], [3, 5], [4, 5], [0, 5], [-1, 5], [-2, 5], [-3, 5], [-4, 5],

        //     [1, -5], [2, -5], [3, -5], [4, -5], [0, -5], [-1, -5], [-2, -5], [-3, -5], [-4, -5],
        //     [-5, 1], [-5, 2], [-5, 3], [-5, 4], [-5, 0], [-5, -1], [-5, -2], [-5, -3], [-5, -4],
        // ],
        [STRUCTURE_LAB]: [[-3, 2], [-4, 2], [-4, 3]],
        [STRUCTURE_TERMINAL]: [[1, 0]],
    },
    7: {
        [STRUCTURE_EXTENSION]: [[-5, 2], [3, 1], [4, 2], [5, 2], [-1, 3], [1, 3], [2, 3], [4, 3], [5, 3], [-1, 4]],
        // [STRUCTURE_RAMPART]: [
        //     [4, 1], [4, 2], [4, 3], [4, 0], [4, -1], [4, -2], [4, -3], [4, -4],
        //     [1, 4], [2, 4], [3, 4], [4, 4], [0, 4], [-1, 4], [-2, 4], [-3, 4],

        //     [-4, 1], [-4, 2], [-4, 3], [-4, 4], [-4, 0], [-4, -1], [-4, -2], [-4, -3],
        //     [1, -4], [2, -4], [3, -4], [0, -4], [-1, -4], [-2, -4], [-3, -4], [-4, -4],
        // ],
        [STRUCTURE_LAB]: [[-2, 3], [-2, 4], [-3, 4]],
        [STRUCTURE_TOWER]: [[-6, 0]],
        [STRUCTURE_FACTORY]: [[-1, 0]],
    },
    8: {
        [STRUCTURE_EXTENSION]: [[1, 4], [2, 4], [3, 4], [5, 4], [-1, 4], [1, 5], [2, 5], [3, 5], [4, 5], [-1, 5], [-2, 5]],
        [STRUCTURE_LAB]: [[-3, 5], [-4, 5], [-5, 3], [-5, 4]],
        [STRUCTURE_TOWER]: [[6, 0], [0, 6], [3, 2]],
        [STRUCTURE_SPAWN]: [[2, 0], [-2, 0]],
        [STRUCTURE_POWER_SPAWN]: [[0, 2]],
        [STRUCTURE_NUKER]: [[0, -2]],
    }
}

export const reactionConfig = {
    [RESOURCE_CATALYZED_GHODIUM_ACID]: 10000,        // WORK     +100% upgradeController 效率但不增加其能量消耗
    [RESOURCE_CATALYZED_GHODIUM_ALKALIDE]: 10000,    // TOUGH    70% 伤害减免
    [RESOURCE_CATALYZED_KEANIUM_ACID]: 10000,        // CARRY    +150 容量
    [RESOURCE_CATALYZED_KEANIUM_ALKALIDE]: 10000,    // R_A      +300% rangedAttack 和 rangedMassAttack 效率
    [RESOURCE_CATALYZED_LEMERGIUM_ACID]: 10000,      // WORK     +100% repair 和 build 效率但不增加其能量消耗
    [RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE]: 10000,  // HEAL     +300% heal and rangedHeal 效率
    [RESOURCE_CATALYZED_UTRIUM_ACID]: 10000,         // ATTACK   +300% attack 效率
    [RESOURCE_CATALYZED_UTRIUM_ALKALIDE]: 10000,     // WORK     +600% harvest 效率
    [RESOURCE_CATALYZED_ZYNTHIUM_ACID]: 10000,       // WORK     +300% dismantle 效率
    [RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE]: 10000,   // MOVE     +300% fatigue(疲劳值) 减低速度

    [RESOURCE_GHODIUM]: 10000,                       // Nuker    !!!

    [RESOURCE_GHODIUM_ACID]: 10000,
    [RESOURCE_GHODIUM_ALKALIDE]: 10000,
    [RESOURCE_KEANIUM_ACID]: 10000,
    [RESOURCE_KEANIUM_ALKALIDE]: 10000,
    [RESOURCE_LEMERGIUM_ACID]: 10000,
    [RESOURCE_LEMERGIUM_ALKALIDE]: 10000,
    [RESOURCE_UTRIUM_ACID]: 10000,
    [RESOURCE_UTRIUM_ALKALIDE]: 10000,
    [RESOURCE_ZYNTHIUM_ACID]: 10000,
    [RESOURCE_ZYNTHIUM_ALKALIDE]: 10000,

    [RESOURCE_GHODIUM_HYDRIDE]: 10000,
    [RESOURCE_GHODIUM_OXIDE]: 10000,
    [RESOURCE_KEANIUM_HYDRIDE]: 10000,
    [RESOURCE_KEANIUM_OXIDE]: 10000,
    [RESOURCE_LEMERGIUM_HYDRIDE]: 10000,
    [RESOURCE_LEMERGIUM_OXIDE]: 10000,
    [RESOURCE_UTRIUM_HYDRIDE]: 10000,
    [RESOURCE_UTRIUM_OXIDE]: 10000,
    [RESOURCE_ZYNTHIUM_HYDRIDE]: 10000,
    [RESOURCE_ZYNTHIUM_OXIDE]: 10000,

    [RESOURCE_ZYNTHIUM_KEANITE]: 10000,
    [RESOURCE_UTRIUM_LEMERGITE]: 10000,
    [RESOURCE_HYDROXIDE]: 10000,
}


// 从反应目标产物获取其底物的对应表
export const reactionSource: IReactionSource = {
    // 三级化合物
    [RESOURCE_CATALYZED_GHODIUM_ACID]: [RESOURCE_GHODIUM_ACID, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_GHODIUM_ALKALIDE]: [RESOURCE_GHODIUM_ALKALIDE, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_KEANIUM_ACID]: [RESOURCE_KEANIUM_ACID, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_KEANIUM_ALKALIDE]: [RESOURCE_KEANIUM_ALKALIDE, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_LEMERGIUM_ACID]: [RESOURCE_LEMERGIUM_ACID, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE]: [RESOURCE_LEMERGIUM_ALKALIDE, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_UTRIUM_ACID]: [RESOURCE_UTRIUM_ACID, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_UTRIUM_ALKALIDE]: [RESOURCE_UTRIUM_ALKALIDE, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_ZYNTHIUM_ACID]: [RESOURCE_ZYNTHIUM_ACID, RESOURCE_CATALYST],
    [RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE]: [RESOURCE_ZYNTHIUM_ALKALIDE, RESOURCE_CATALYST],
    // 二级化合物
    [RESOURCE_GHODIUM_ACID]: [RESOURCE_GHODIUM_HYDRIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_GHODIUM_ALKALIDE]: [RESOURCE_GHODIUM_OXIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_KEANIUM_ACID]: [RESOURCE_KEANIUM_HYDRIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_KEANIUM_ALKALIDE]: [RESOURCE_KEANIUM_OXIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_LEMERGIUM_ACID]: [RESOURCE_LEMERGIUM_HYDRIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_LEMERGIUM_ALKALIDE]: [RESOURCE_LEMERGIUM_OXIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_UTRIUM_ACID]: [RESOURCE_UTRIUM_HYDRIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_UTRIUM_ALKALIDE]: [RESOURCE_UTRIUM_OXIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_ZYNTHIUM_ACID]: [RESOURCE_ZYNTHIUM_HYDRIDE, RESOURCE_HYDROXIDE],
    [RESOURCE_ZYNTHIUM_ALKALIDE]: [RESOURCE_ZYNTHIUM_OXIDE, RESOURCE_HYDROXIDE],
    // 一级化合物
    [RESOURCE_GHODIUM_HYDRIDE]: [RESOURCE_GHODIUM, RESOURCE_HYDROGEN],
    [RESOURCE_GHODIUM_OXIDE]: [RESOURCE_GHODIUM, RESOURCE_OXYGEN],
    [RESOURCE_KEANIUM_HYDRIDE]: [RESOURCE_KEANIUM, RESOURCE_HYDROGEN],
    [RESOURCE_KEANIUM_OXIDE]: [RESOURCE_KEANIUM, RESOURCE_OXYGEN],
    [RESOURCE_LEMERGIUM_HYDRIDE]: [RESOURCE_LEMERGIUM, RESOURCE_HYDROGEN],
    [RESOURCE_LEMERGIUM_OXIDE]: [RESOURCE_LEMERGIUM, RESOURCE_OXYGEN],
    [RESOURCE_UTRIUM_HYDRIDE]: [RESOURCE_UTRIUM, RESOURCE_HYDROGEN],
    [RESOURCE_UTRIUM_OXIDE]: [RESOURCE_UTRIUM, RESOURCE_OXYGEN],
    [RESOURCE_ZYNTHIUM_HYDRIDE]: [RESOURCE_ZYNTHIUM, RESOURCE_HYDROGEN],
    [RESOURCE_ZYNTHIUM_OXIDE]: [RESOURCE_ZYNTHIUM, RESOURCE_OXYGEN],
    [RESOURCE_GHODIUM]: [RESOURCE_ZYNTHIUM_KEANITE, RESOURCE_UTRIUM_LEMERGITE],
    // 基础化合物
    [RESOURCE_ZYNTHIUM_KEANITE]: [RESOURCE_ZYNTHIUM, RESOURCE_KEANIUM],
    [RESOURCE_UTRIUM_LEMERGITE]: [RESOURCE_UTRIUM, RESOURCE_LEMERGIUM],
    [RESOURCE_HYDROXIDE]: [RESOURCE_HYDROGEN, RESOURCE_OXYGEN],
}
