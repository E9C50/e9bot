import { assignPrototype } from "utils"
import CreepExtension from "./extension/CreepExtension"
import RoomExtension from "./extension/RoomExtension"
import SourceExtension from "./extension/SourceExtension"
import MineralExtension from "./extension/MineralExtension"
import SpawnExtension from "./structure/SpawnExtension"
import LinkExtension from "./structure/LinkExtension"
import TowerExtension from "./structure/TowerExtension"
import LabExtension from "./structure/LabExtension"

function processFlagPos(flagName: string, memoryKey: string): void {
    if (Game.flags[flagName] != undefined) {
        const roomName = Game.flags[flagName].pos.roomName;
        Game.rooms[roomName].memory[memoryKey] = Game.flags[flagName].pos;
        Game.flags[flagName].remove();
    }
}

function processFlagStructure(flagName: string, memoryKey: string): void {
    if (Game.flags[flagName] != undefined) {
        const roomName = Game.flags[flagName].pos.roomName;
        Game.rooms[roomName].memory[memoryKey] = Game.flags[flagName].pos.lookFor(LOOK_STRUCTURES)[0].id;
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
    assignPrototype(StructureLab, LabExtension)

    processFlagPos('infoPos', 'infoPos')
    processFlagPos('centerPos', 'centerPos')
    processFlagPos('managerPos', 'managerPos')

    processFlagStructure('lab1', 'sourceLab1')
    processFlagStructure('lab2', 'sourceLab2')
    processFlagStructure('repairTower', 'towerAllowRepair')
}
