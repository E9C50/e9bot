import { assignGlobal, assignPrototype } from "utils"
import CreepExtension from "./extension/CreepExtension"
import RoomExtension from "./extension/RoomExtension"
import SpawnExtension from "./structure/SpawnExtension"
import LinkExtension from "./structure/LinkExtension"
import TowerExtension from "./structure/TowerExtension"
import LabExtension from "./structure/LabExtension"
import PowerSpawnExtension from "./structure/PowerSpawnExtension"
import NukerExtension from "./structure/NukerExtension"
import FactoryExtension from "./structure/FactoryExtension"
import ConsoleExtension from "./extension/ConsoleExtension"
import PositionExtension from "./extension/PositionExtension"
import PowerCreepExtension from "./extension/PowerCreepExtension"


export function mountWork() {
    assignGlobal(ConsoleExtension)

    assignPrototype(Room, RoomExtension)
    assignPrototype(Creep, CreepExtension)
    assignPrototype(PowerCreep, PowerCreepExtension)
    assignPrototype(RoomPosition, PositionExtension)

    assignPrototype(StructureLab, LabExtension)
    assignPrototype(StructureLink, LinkExtension)
    assignPrototype(StructureSpawn, SpawnExtension)
    assignPrototype(StructureTower, TowerExtension)
    assignPrototype(StructureNuker, NukerExtension)
    assignPrototype(StructureFactory, FactoryExtension)
    assignPrototype(StructurePowerSpawn, PowerSpawnExtension)
}
