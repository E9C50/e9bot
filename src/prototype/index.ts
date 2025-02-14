import CreepBaseWorkExtension from "./creeps/CreepBaseWorkExtension"
import CreepExtension from "./creeps/CreepExtension"
import PowerExtension from "./powers/PowerExtension"
import PositionExtension from "./rooms/PositionExtension"
import RoomExtension from "./rooms/RoomExtension"
import SpawnExtension from "./structures/SpawnExtension"

/**
 * 挂载到全局
 * @param obj
 */
function assignGlobal(obj: { [key: string]: any }) {
    Object.getOwnPropertyNames(obj.prototype).forEach(key => {
        global[key] = obj.prototype[key]
    })
}

/**
 * 把 obj2 的原型合并到 obj1 的原型上
 * 如果原型的键以 Getter 结尾，则将会把其挂载为 getter 属性
 * @param obj1 要挂载到的对象
 * @param obj2 要进行挂载的对象
 */
function assignPrototype(obj1: { [key: string]: any }, obj2: { [key: string]: any }) {
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

/** 原型拓展 */
export const MountPrototype = function () {
    // 挂载全部拓展
    assignPrototype(Room, RoomExtension)
    assignPrototype(Creep, CreepExtension)
    assignPrototype(Creep, CreepBaseWorkExtension)
    assignPrototype(PowerCreep, PowerExtension)
    assignPrototype(RoomPosition, PositionExtension)

    assignPrototype(StructureSpawn, SpawnExtension)
}

