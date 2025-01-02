import { assignPrototype } from "utils"
import CreepExtension from "./extension/CreepExtension"
import RoomExtension from "./extension/RoomExtension"
import SourceExtension from "./extension/SourceExtension"
import MineralExtension from "./extension/MineralExtension"
import SpawnExtension from "./structure/SpawnExtension"
import LinkExtension from "./structure/LinkExtension"
import TowerExtension from "./structure/TowerExtension"

function processFlag(flagName: string, memoryKey: string): void {
    if (Game.flags[flagName] != undefined) {
        const roomName = Game.flags[flagName].pos.roomName;
        Game.rooms[roomName].memory[memoryKey] = Game.flags[flagName].pos;
        Game.flags[flagName].remove();
    }
}

export function mountWork() {
    assignPrototype(Creep, CreepExtension)
    assignPrototype(Room, RoomExtension)
    assignPrototype(Source, SourceExtension)
    assignPrototype(Mineral, MineralExtension)

    assignPrototype(StructureSpawn, SpawnExtension)
    assignPrototype(StructureLink, LinkExtension)
    assignPrototype(StructureTower, TowerExtension)

    processFlag('infoPos', 'infoPos')
    processFlag('centerPos', 'centerPos')
    processFlag('managerPos', 'managerPos')
}
