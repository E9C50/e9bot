import { assignPrototype } from "utils/PrototypeBinds"
import CreepBaseWorkExtension from "./creeps/CreepBaseWorkExtension"
import CreepExtension from "./creeps/CreepExtension"
import PowerExtension from "./powers/PowerExtension"
import PositionExtension from "./rooms/PositionExtension"
import RoomExtension from "./rooms/RoomExtension"
import SpawnExtension from "./structures/SpawnExtension"

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

