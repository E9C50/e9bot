
export const STRUCTURE_PRIVATEKEY_PERFIX = '_'
export const STRUCTURE_MEMORYKEY_PERFIX = 'IDOF_'

export const creepWhiteList = ['an_w', 'NoName_', 'MoSaSa', 'Kaoruko', 'keqing']

// 永不踏入这些房间
export const findPathAvoidRooms = [
    'E39N4', 'E38N1', 'E39N1', 'E32N2', 'E33N5'
]
export const enableObserversFindPath = true
export const observersFindPathIdList = [
]

export const defaultReserverSign = 'RESERVED BY E9C50, PLEASE STAY AWAY ⚠️⚠️⚠️'
export const roomSignTextList = [
    '用兵之法，无恃其不来，恃吾有以待也；无恃其不攻，恃吾有所不可攻也。',
    '智者之虑，必杂于利害；杂于利，而务可信也；杂于害，而患可解也。',
    '兵之情主速，乘人之不及，由不虞之道，攻其所不戒也。',
    '兵形象水，水之行，避高而趋下；兵之形，避实而击虚。',
    '兵无常势，水无常形，能因敌变化而取胜者，谓之神。',
    '兵者，国之大事，死生之地，存亡之道，不可不察也。',
    '善守者，藏于九地之下；善攻者，动于九天之上。',
    '五行无常胜，四时无常位，日有短长，月有死生。',
    '知彼知己，胜乃不殆；知天知地，胜乃不穷。',
    '不尽知用兵之害者，则不能尽知用兵之利也。',
    '上兵伐谋，其次伐交，其次伐兵，其下攻城。',
    '善用兵者，避其锐气，击其惰归。',
    '不战而屈人之兵，善之善者也。',
]

export enum boostTypeEnum {
    BoostTypeMove = 'boostMove',
    BoostTypeCarry = 'boostCarry',

    BoostTypeBuild = 'boostBuild',
    BoostTypeUpgrade = 'boostUpgrade',
    BoostTypeHarvest = 'boostHarvest',
    BoostTypeDismantle = 'boostDismantle',

    BoostTypeHeal = 'boostHeal',
    BoostTypeTough = 'boostTough',
    BoostTypeAttack = 'boostAttack',
    BoostTypeRangedAttack = 'boostRAttack',
}

export enum roleBaseEnum {
    HARVESTER = 'harvester',
    FILLER = 'filler',
    UPGRADER = 'upgrader',
    BUILDER = 'builder',
    REPAIRER = 'repairer',
    MINER = 'miner',
    SCOUT = 'scout',
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
    CONTROLLER_ATTACKER = 'cAttacker',
    DISMANTLER = 'dismantler',
    INTEGRATE = 'integrate',
    DEFENDER = 'defender',
    RDEFENDER = 'rdefender'
}

export const roleTeam = 'team'

export const warModeRole: CreepRoleConstant[] = [
    roleBaseEnum.FILLER, roleBaseEnum.REPAIRER, roleAdvEnum.PROCESSER, roleAdvEnum.MANAGER,
    roleWarEnum.ATTACKER, roleWarEnum.DISMANTLER, roleWarEnum.HEALER, roleWarEnum.CONTROLLER_ATTACKER,
    roleWarEnum.INTEGRATE, roleWarEnum.RANGED_ATTACKER, roleWarEnum.DEFENDER, roleWarEnum.RDEFENDER
]

export enum colorEnum {
    RED = '#ef9a9a',
    GREEN = '#6b9955',
    YELLOW = '#c5c599',
    BLUE = '#8dc5e3'
}

export const spawnPriority: { [role in CreepRoleConstant]: number } = {
    manager: 0,
    harvester: 1,
    filler: 2,
    processer: 3,
    scout: 3,
    builder: 4,
    upgrader: 5,
    repairer: 6,
    miner: 7,

    claimer: 9,
    rHarvester: 10,
    rFiller: 11,
    rBuilder: 12,
    reserver: 13,

    integrate: 3,
    defender: 3,
    rdefender: 3,
    attacker: 14,
    healer: 15,
    rAttacker: 16,
    dismantler: 17,
    cAttacker: 17
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
    { [WORK]: 20, [CARRY]: 10, [MOVE]: 20 }
]

const carryBodyConfigs = [
    { [CARRY]: 2, [MOVE]: 2 },
    { [CARRY]: 3, [MOVE]: 3 },
    { [CARRY]: 4, [MOVE]: 2 },
    { [CARRY]: 5, [MOVE]: 3 },
    { [CARRY]: 8, [MOVE]: 4 },
    { [CARRY]: 14, [MOVE]: 7 },
    { [CARRY]: 20, [MOVE]: 10 },
    { [CARRY]: 33, [MOVE]: 17 }
]

export const bodyConfigs: { [role in CreepRoleConstant]: BodySet[] } = {
    harvester: workerBodyConfigs,
    upgrader: Array.from({ length: 8 }, () => ({ [WORK]: 39, [CARRY]: 1, [MOVE]: 10 })),
    builder: workerBodyConfigs,
    repairer: workerBodyConfigs,
    miner: workerBodyConfigs,
    filler: carryBodyConfigs,
    rBuilder: Array.from({ length: 8 }, () => ({ [WORK]: 39, [CARRY]: 1, [MOVE]: 10 })),
    rFiller: Array.from({ length: 8 }, () => ({ [CARRY]: 40, [MOVE]: 10 })),
    processer: carryBodyConfigs,
    scout: Array.from({ length: 8 }, () => ({ [MOVE]: 1 })),
    claimer: Array.from({ length: 8 }, () => ({ [CLAIM]: 1, [MOVE]: 1 })),
    cAttacker: Array.from({ length: 8 }, () => ({ [CLAIM]: 1, [MOVE]: 1 })),
    manager: [
        { [CARRY]: 5, [MOVE]: 1 },
        { [CARRY]: 10, [MOVE]: 1 },
        { [CARRY]: 15, [MOVE]: 1 },
        { [CARRY]: 25, [MOVE]: 1 },
        { [CARRY]: 35, [MOVE]: 1 },
        { [CARRY]: 45, [MOVE]: 1 },
        { [CARRY]: 49, [MOVE]: 1 },
        { [CARRY]: 49, [MOVE]: 1 }
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
    attacker: [
        { [MOVE]: 2, [ATTACK]: 2 },
        { [MOVE]: 3, [ATTACK]: 3 },
        { [MOVE]: 4, [ATTACK]: 4 },
        { [MOVE]: 5, [ATTACK]: 5 },
        { [MOVE]: 6, [ATTACK]: 6 },
        { [MOVE]: 7, [ATTACK]: 7 },
        { [MOVE]: 8, [ATTACK]: 8 },
        { [TOUGH]: 1, [ATTACK]: 39, [MOVE]: 10, }
    ],
    integrate: [
        { [TOUGH]: 0, [MOVE]: 0, [RANGED_ATTACK]: 0, [HEAL]: 0 },
        { [TOUGH]: 0, [MOVE]: 0, [RANGED_ATTACK]: 0, [HEAL]: 0 },
        { [TOUGH]: 0, [MOVE]: 0, [RANGED_ATTACK]: 0, [HEAL]: 0 },
        { [TOUGH]: 0, [MOVE]: 0, [RANGED_ATTACK]: 0, [HEAL]: 0 },
        { [TOUGH]: 0, [MOVE]: 0, [RANGED_ATTACK]: 0, [HEAL]: 0 },
        { [TOUGH]: 0, [MOVE]: 0, [RANGED_ATTACK]: 0, [HEAL]: 0 },
        { [TOUGH]: 0, [MOVE]: 0, [RANGED_ATTACK]: 0, [HEAL]: 0 },
        // { [TOUGH]: 2, [RANGED_ATTACK]: 36, [MOVE]: 10, [HEAL]: 2 }, // 防御
        { [TOUGH]: 7, [RANGED_ATTACK]: 19, [MOVE]: 10, [HEAL]: 14 }, // 7级房进攻
        // { [TOUGH]: 8, [MOVE]: 10, [RANGED_ATTACK]: 15, [HEAL]: 17 }, // 四级要塞
        // { [TOUGH]: 2, [RANGED_ATTACK]: 25, [HEAL]: 13, [MOVE]: 10 }, // 一级要塞
    ],
    healer: [
        { [MOVE]: 2, [HEAL]: 2 },
        { [MOVE]: 3, [HEAL]: 3 },
        { [MOVE]: 4, [HEAL]: 4 },
        { [MOVE]: 5, [HEAL]: 5 },
        { [MOVE]: 6, [HEAL]: 6 },
        { [MOVE]: 7, [HEAL]: 7 },
        { [MOVE]: 8, [HEAL]: 8 },
        { [MOVE]: 25, [HEAL]: 25 }
    ],
    rAttacker: [],
    dismantler: [],
    defender: [
        { [ATTACK]: 2, [MOVE]: 2 },
        { [ATTACK]: 3, [MOVE]: 3 },
        { [ATTACK]: 4, [MOVE]: 4 },
        { [ATTACK]: 5, [MOVE]: 5 },
        { [ATTACK]: 6, [MOVE]: 6 },
        { [ATTACK]: 7, [MOVE]: 7 },
        { [ATTACK]: 40, [MOVE]: 10 },
        { [ATTACK]: 40, [MOVE]: 10 }
    ],
    rdefender: [
        { [RANGED_ATTACK]: 2, [MOVE]: 2 },
        { [RANGED_ATTACK]: 3, [MOVE]: 3 },
        { [RANGED_ATTACK]: 4, [MOVE]: 4 },
        { [RANGED_ATTACK]: 5, [MOVE]: 5 },
        { [RANGED_ATTACK]: 6, [MOVE]: 6 },
        { [RANGED_ATTACK]: 7, [MOVE]: 7 },
        { [RANGED_ATTACK]: 40, [MOVE]: 10 },
        { [RANGED_ATTACK]: 40, [MOVE]: 10 }
    ],
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

export const defaultAutoResource = {
    [RESOURCE_CATALYZED_GHODIUM_ALKALIDE]: 10000,     // tough
    [RESOURCE_CATALYZED_KEANIUM_ALKALIDE]: 10000,     // rangedAttack
    [RESOURCE_CATALYZED_LEMERGIUM_ACID]: 10000,       // build
    [RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE]: 10000,   // heal
    [RESOURCE_CATALYZED_UTRIUM_ACID]: 10000,          // attack
    [RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE]: 10000,    // fatigue

    [RESOURCE_POWER]: 3000,
    [RESOURCE_OPS]: 3000,

    [RESOURCE_GHODIUM]: 10000,

    [RESOURCE_CATALYST]: 10000,
    [RESOURCE_LEMERGIUM]: 10000,
    [RESOURCE_ZYNTHIUM]: 10000,
    [RESOURCE_KEANIUM]: 10000,
    [RESOURCE_UTRIUM]: 10000,
    [RESOURCE_OXYGEN]: 10000,
    [RESOURCE_HYDROGEN]: 10000,
}

export const reactionConfig = {
    // [RESOURCE_CATALYZED_GHODIUM_ACID]: 100000,        // WORK     +100% upgradeController 效率但不增加其能量消耗
    // [RESOURCE_CATALYZED_GHODIUM_ALKALIDE]: 100000,    // TOUGH    70% 伤害减免

    [RESOURCE_CATALYZED_LEMERGIUM_ACID]: 100000,      // WORK     +100% repair 和 build 效率但不增加其能量消耗
    [RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE]: 100000,  // HEAL     +300% heal and rangedHeal 效率

    [RESOURCE_CATALYZED_KEANIUM_ACID]: 100000,        // CARRY    +150 容量
    [RESOURCE_CATALYZED_KEANIUM_ALKALIDE]: 100000,    // R_A      +300% rangedAttack 和 rangedMassAttack 效率

    [RESOURCE_CATALYZED_UTRIUM_ACID]: 100000,         // ATTACK   +300% attack 效率
    [RESOURCE_CATALYZED_UTRIUM_ALKALIDE]: 100000,     // WORK     +600% harvest 效率

    [RESOURCE_CATALYZED_ZYNTHIUM_ACID]: 100000,       // WORK     +300% dismantle 效率
    [RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE]: 100000,   // MOVE     +300% fatigue(疲劳值) 减低速度

    [RESOURCE_GHODIUM]: 100000,                       // Nuker    !!!

    // [RESOURCE_GHODIUM_ACID]: 100000,
    // [RESOURCE_GHODIUM_ALKALIDE]: 100000,

    [RESOURCE_LEMERGIUM_ACID]: 100000,
    [RESOURCE_LEMERGIUM_ALKALIDE]: 100000,

    [RESOURCE_KEANIUM_ACID]: 100000,
    [RESOURCE_KEANIUM_ALKALIDE]: 100000,

    [RESOURCE_UTRIUM_ACID]: 100000,
    [RESOURCE_UTRIUM_ALKALIDE]: 100000,

    [RESOURCE_ZYNTHIUM_ACID]: 100000,
    [RESOURCE_ZYNTHIUM_ALKALIDE]: 100000,


    [RESOURCE_GHODIUM_HYDRIDE]: 100000,
    [RESOURCE_GHODIUM_OXIDE]: 100000,

    [RESOURCE_LEMERGIUM_HYDRIDE]: 100000,
    [RESOURCE_LEMERGIUM_OXIDE]: 100000,

    [RESOURCE_KEANIUM_HYDRIDE]: 100000,
    [RESOURCE_KEANIUM_OXIDE]: 100000,

    [RESOURCE_UTRIUM_HYDRIDE]: 100000,
    [RESOURCE_UTRIUM_OXIDE]: 100000,

    [RESOURCE_ZYNTHIUM_HYDRIDE]: 100000,
    [RESOURCE_ZYNTHIUM_OXIDE]: 100000,

    [RESOURCE_ZYNTHIUM_KEANITE]: 100000,
    [RESOURCE_UTRIUM_LEMERGITE]: 100000,
    [RESOURCE_HYDROXIDE]: 100000,
}

// 角色对应的需要boost的配置
export const roleBoostConfig: { [role in CreepRoleConstant]?: BoostTypeConstant[] } = {
    // repairer: [boostTypeEnum.BoostTypeBuild],
    upgrader: [boostTypeEnum.BoostTypeUpgrade],
    rBuilder: [boostTypeEnum.BoostTypeUpgrade, boostTypeEnum.BoostTypeMove],
    rFiller: [boostTypeEnum.BoostTypeCarry, boostTypeEnum.BoostTypeMove],
    healer: [boostTypeEnum.BoostTypeHeal, boostTypeEnum.BoostTypeMove],
    attacker: [boostTypeEnum.BoostTypeAttack, boostTypeEnum.BoostTypeMove, boostTypeEnum.BoostTypeTough],
    defender: [boostTypeEnum.BoostTypeAttack, boostTypeEnum.BoostTypeMove],
    rdefender: [boostTypeEnum.BoostTypeRangedAttack, boostTypeEnum.BoostTypeMove],
    integrate: [
        boostTypeEnum.BoostTypeRangedAttack, boostTypeEnum.BoostTypeHeal,
        boostTypeEnum.BoostTypeMove, boostTypeEnum.BoostTypeTough
    ],
}

// boost类型对应BodyPart
export const boostBodyPart: BoostBodyPartConfig = {
    boostMove: MOVE,
    boostCarry: CARRY,
    boostBuild: WORK,
    boostUpgrade: WORK,
    boostHarvest: WORK,
    boostDismantle: WORK,
    boostHeal: HEAL,
    boostTough: TOUGH,
    boostAttack: ATTACK,
    boostRAttack: RANGED_ATTACK
}

// boost所需化合物配置
export const boostConfig: BoostResourceConfig = {
    boostMove: [RESOURCE_ZYNTHIUM_OXIDE, RESOURCE_ZYNTHIUM_ALKALIDE, RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE],
    boostCarry: [RESOURCE_KEANIUM_HYDRIDE, RESOURCE_KEANIUM_ACID, RESOURCE_CATALYZED_KEANIUM_ACID],
    boostBuild: [RESOURCE_CATALYZED_LEMERGIUM_ACID, RESOURCE_LEMERGIUM_ACID, RESOURCE_LEMERGIUM_HYDRIDE],
    boostUpgrade: [RESOURCE_GHODIUM_HYDRIDE, RESOURCE_GHODIUM_ACID, RESOURCE_CATALYZED_GHODIUM_ACID],
    boostHarvest: [RESOURCE_UTRIUM_OXIDE, RESOURCE_UTRIUM_ALKALIDE, RESOURCE_CATALYZED_UTRIUM_ALKALIDE],
    boostDismantle: [RESOURCE_ZYNTHIUM_HYDRIDE, RESOURCE_ZYNTHIUM_ACID, RESOURCE_CATALYZED_ZYNTHIUM_ACID],
    boostHeal: [RESOURCE_LEMERGIUM_OXIDE, RESOURCE_LEMERGIUM_ALKALIDE, RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE],
    boostTough: [RESOURCE_GHODIUM_OXIDE, RESOURCE_GHODIUM_ALKALIDE, RESOURCE_CATALYZED_GHODIUM_ALKALIDE],
    boostAttack: [RESOURCE_UTRIUM_HYDRIDE, RESOURCE_UTRIUM_ACID, RESOURCE_CATALYZED_UTRIUM_ACID],
    boostRAttack: [RESOURCE_KEANIUM_OXIDE, RESOURCE_KEANIUM_ALKALIDE, RESOURCE_CATALYZED_KEANIUM_ALKALIDE]
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
