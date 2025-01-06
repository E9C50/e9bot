import jsSHA from "jssha";
import { min } from "lodash";
import { colorEnum, roleAdvEnum } from "settings";

/**
 * 把 obj2 的原型合并到 obj1 的原型上
 * 如果原型的键以 Getter 结尾，则将会把其挂载为 getter 属性
 * @param obj1 要挂载到的对象
 * @param obj2 要进行挂载的对象
 */
export const assignPrototype = function (obj1: { [key: string]: any }, obj2: { [key: string]: any }) {
    Object.getOwnPropertyNames(obj2.prototype).forEach(key => {
        if (key.includes('Getter')) {
            Object.defineProperty(obj1.prototype, key.split('Getter')[0], {
                get: obj2.prototype[key],
                enumerable: false,
                configurable: true
            })
        } else if (key.includes('Setter')) {
            Object.defineProperty(obj1.prototype, key.split('Setter')[0], {
                set: obj2.prototype[key],
                enumerable: false,
                configurable: true
            })
        } else obj1.prototype[key] = obj2.prototype[key]
    })
}

/**
 * 构建BodyPart
 * @param room
 * @param bodyConfigs
 * @param forceSpawn
 * @returns
 */
export const getBodyConfig = function (room: Room, bodyConfigs: BodySet[], forceSpawn: boolean = false): BodyPartConstant[] {
    const energy = forceSpawn ? room.energyAvailable : room.energyCapacityAvailable;

    var bodyConfig: BodyPartConstant[] = [];
    for (let i = 7; i >= 0; i--) {
        var needEnergy = 0;
        for (let config in bodyConfigs[i]) {
            needEnergy += BODYPART_COST[config] * bodyConfigs[i][config];
        }

        if (needEnergy <= energy) {
            for (let config in bodyConfigs[i]) {
                bodyConfig = bodyConfig.concat(
                    Array.from({ length: bodyConfigs[i][config] }, (k, v) => config as BodyPartConstant)
                );
            }
            break;
        }
    }

    return bodyConfig;
}

/**
 * 获取两个Position的距离
 * @param pos1
 * @param pos2
 * @returns
 */
export const getDistance = function (pos1: RoomPosition, pos2: RoomPosition): number {
    return Math.max(Math.abs(pos1.x - pos2.x), Math.abs(pos1.y - pos2.y))
}

/**
 * 寻找最近的目标
 * @param source
 * @param targetList
 * @returns
 */
export const getClosestTarget = function <T extends Creep | Structure | ConstructionSite>(source: RoomPosition, targetList: T[]): T {
    let closest: T = targetList[0]
    let minRange: number = Infinity

    for (let index in targetList) {
        let targetRange = getDistance(source, targetList[index].pos)
        if (targetRange < minRange) {
            minRange = targetRange
            closest = targetList[index]
        }
    }

    return closest
}

/**
 * 获取房间中指定资源的数量
 * @param room
 * @param resourceType
 * @returns
 */
export const getRoomResourceByType = function (room: Room, resourceType: ResourceConstant): number {
    const storageEnergy = room.storage ? room.storage.store[resourceType] : 0;
    const terminalEnergy = room.terminal ? room.terminal.store[resourceType] : 0;
    const labsEnergy = room.labs.reduce((pre, lab) => pre + (lab.mineralType == resourceType ? lab.store[resourceType] : 0), 0);
    const creepEnergy = Object.values(Game.creeps)
        .filter(creep => creep.room.name == room.name && [roleAdvEnum.PROCESSER, roleAdvEnum.MANAGER].includes(creep.memory.role as roleAdvEnum))
        .reduce((pre, creep) => pre + (creep.store[resourceType] ? creep.store[resourceType] : 0), 0);
    const totalEnergy = storageEnergy + terminalEnergy + labsEnergy + creepEnergy;
    return totalEnergy
}

/**
 * 对输入的字符串进行拼接并且进行SHA1
 * @param strings 输入的n个字符串
 * @returns
 */
export const sha1String = function (...strings: string[]): string {
    const concatenatedString = strings.join('_')
    const shaObj = new jsSHA("SHA-1", "TEXT", { encoding: "UTF8" })
    shaObj.update(concatenatedString)
    return shaObj.getHash("HEX").toUpperCase().substring(0, 10)
}

/**
 * 给指定文本添加颜色
 *
 * @param content 要添加颜色的文本
 * @param colorName 要添加的颜色常量字符串
 * @param bolder 是否加粗
 */
export function colorful(content: string, colorName: colorEnum, bolder: boolean = false): string {
    const colorStyle = colorName ? `color: ${colorName.valueOf};` : ''
    const bolderStyle = bolder ? 'font-weight: bolder;' : ''

    return `<text style="${[colorStyle, bolderStyle].join(' ')}">${content}</text>`
}

/**
 * 全局日志
 *
 * @param content 日志内容
 * @param prefixes 前缀中包含的内容
 * @param color 日志前缀颜色
 * @param notify 是否发送邮件
 */
export function log(content: string, prefixes: string[] = [], color: colorEnum = colorEnum.GREEN, notify: boolean = false): OK {
    // 有前缀就组装在一起
    let prefix = prefixes.length > 0 ? `【${prefixes.join(' ')}】 ` : ''
    // 指定了颜色
    prefix = colorful(prefix, color, true)

    const logContent = `${prefix}${content}`
    console.log(logContent)
    // 转发到邮箱
    if (notify) Game.notify(logContent)

    return OK
}
