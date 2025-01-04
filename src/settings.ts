
export const STRUCTURE_PRIVATEKEY_PERFIX = '_'
export const STRUCTURE_MEMORYKEY_PERFIX = 'IDOF_'

export const defaultConrtollerSign = 'I am a novice and a peaceful player. Please do not attack me!!!'

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

export const bodyConfigs = {
    upgrader: workerBodyConfigs,
    builder: workerBodyConfigs,
    repairer: workerBodyConfigs,
    miner: workerBodyConfigs,
    filler: carryBodyConfigs,
    processer: carryBodyConfigs,
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
        { [WORK]: 1, [CARRY]: 1, [MOVE]: 1 },
        { [WORK]: 2, [CARRY]: 2, [MOVE]: 2 },
        { [WORK]: 3, [CARRY]: 3, [MOVE]: 3 },
        { [WORK]: 4, [CARRY]: 6, [MOVE]: 5 },
        { [WORK]: 5, [CARRY]: 9, [MOVE]: 7 },
        { [WORK]: 6, [CARRY]: 10, [MOVE]: 8 },
        { [WORK]: 7, [CARRY]: 15, [MOVE]: 11 },
        { [WORK]: 11, [CARRY]: 15, [MOVE]: 19 }
    ],
    oneWar: [
        { [TOUGH]: 0, [RANGED_ATTACK]: 15, [MOVE]: 6, [HEAL]: 3 },
        { [TOUGH]: 0, [RANGED_ATTACK]: 15, [MOVE]: 6, [HEAL]: 3 },
        { [TOUGH]: 2, [RANGED_ATTACK]: 15, [MOVE]: 6, [HEAL]: 5 },
        { [TOUGH]: 4, [RANGED_ATTACK]: 20, [MOVE]: 9, [HEAL]: 9 },
        { [TOUGH]: 6, [RANGED_ATTACK]: 21, [MOVE]: 10, [HEAL]: 13 },
        { [TOUGH]: 8, [RANGED_ATTACK]: 15, [MOVE]: 10, [HEAL]: 17 },
        { [TOUGH]: 10, [RANGED_ATTACK]: 9, [MOVE]: 10, [HEAL]: 21 },
        { [TOUGH]: 12, [RANGED_ATTACK]: 5, [MOVE]: 10, [HEAL]: 23 }
    ]
}

export const baseLayout = {
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
    [RESOURCE_CATALYZED_GHODIUM_ACID]: 3000,
    [RESOURCE_CATALYZED_GHODIUM_ALKALIDE]: 3000,
    [RESOURCE_CATALYZED_KEANIUM_ACID]: 3000,
    [RESOURCE_CATALYZED_KEANIUM_ALKALIDE]: 3000,
    [RESOURCE_CATALYZED_LEMERGIUM_ACID]: 3000,
    [RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE]: 3000,
    [RESOURCE_CATALYZED_UTRIUM_ACID]: 3000,
    [RESOURCE_CATALYZED_UTRIUM_ALKALIDE]: 3000,
    [RESOURCE_CATALYZED_ZYNTHIUM_ACID]: 3000,
    [RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE]: 3000,

    [RESOURCE_GHODIUM_ACID]: 3000,
    [RESOURCE_GHODIUM_ALKALIDE]: 3000,
    [RESOURCE_KEANIUM_ACID]: 3000,
    [RESOURCE_KEANIUM_ALKALIDE]: 3000,
    [RESOURCE_LEMERGIUM_ACID]: 3000,
    [RESOURCE_LEMERGIUM_ALKALIDE]: 3000,
    [RESOURCE_UTRIUM_ACID]: 3000,
    [RESOURCE_UTRIUM_ALKALIDE]: 3000,
    [RESOURCE_ZYNTHIUM_ACID]: 3000,
    [RESOURCE_ZYNTHIUM_ALKALIDE]: 3000,

    [RESOURCE_GHODIUM_HYDRIDE]: 3000,
    [RESOURCE_GHODIUM_OXIDE]: 3000,
    [RESOURCE_KEANIUM_HYDRIDE]: 3000,
    [RESOURCE_KEANIUM_OXIDE]: 3000,
    [RESOURCE_LEMERGIUM_HYDRIDE]: 3000,
    [RESOURCE_LEMERGIUM_OXIDE]: 3000,
    [RESOURCE_UTRIUM_HYDRIDE]: 3000,
    [RESOURCE_UTRIUM_OXIDE]: 3000,
    [RESOURCE_ZYNTHIUM_HYDRIDE]: 3000,
    [RESOURCE_ZYNTHIUM_OXIDE]: 3000,
    [RESOURCE_GHODIUM]: 3000,

    [RESOURCE_ZYNTHIUM_KEANITE]: 3000,
    [RESOURCE_UTRIUM_LEMERGITE]: 3000,
    [RESOURCE_HYDROXIDE]: 3000,
}
