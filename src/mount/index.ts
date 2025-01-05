import { assignPrototype } from "utils"
import CreepExtension from "./extension/CreepExtension"
import RoomExtension from "./extension/RoomExtension"
import SourceExtension from "./extension/SourceExtension"
import MineralExtension from "./extension/MineralExtension"
import SpawnExtension from "./structure/SpawnExtension"
import LinkExtension from "./structure/LinkExtension"
import TowerExtension from "./structure/TowerExtension"
import LabExtension from "./structure/LabExtension"
import PowerSpawnExtension from "./structure/PowerSpawnExtension"

function processFlagPos(flagName: string, memoryKey: string): void {
    if (Game.flags[flagName] != undefined) {
        const roomName = Game.flags[flagName].pos.roomName;
        Game.rooms[roomName].memory.roomPosition[memoryKey] = Game.flags[flagName].pos;
        Game.flags[flagName].remove();
    }

    if (Game.time % 100 == 0) {
        for (let roomName in Game.rooms) {
            if (!Game.rooms[roomName].my) return
            if (Game.flags[flagName] == undefined && Game.rooms[roomName].memory.roomPosition[memoryKey] == undefined) {
                console.log(`房间 [${roomName}] 请放置旗帜 ${flagName} 用于设置 ${memoryKey} 位置`)
            }
        }
    }
}

function processFlagStructure(flagName: string, memoryKey: string): void {
    if (Game.flags[flagName] != undefined) {
        const roomName = Game.flags[flagName].pos.roomName;
        Game.rooms[roomName].memory.structureIdList[memoryKey] = Game.flags[flagName].pos.lookFor(LOOK_STRUCTURES)[0].id;
        Game.flags[flagName].remove();
    }
    if (Game.time % 10 == 0) {
        for (let roomName in Game.rooms) {
            if (!Game.rooms[roomName].my) return
            if (Game.flags[flagName] == undefined && Game.rooms[roomName].memory.structureIdList[memoryKey] == undefined) {
                console.log(`房间 [${roomName}] 请放置旗帜 ${flagName} 用于设置 ${memoryKey} 建筑`)
            }
        }
    }
}

export function mountWork() {
    assignPrototype(Room, RoomExtension)
    assignPrototype(Creep, CreepExtension)
    assignPrototype(Source, SourceExtension)
    assignPrototype(Mineral, MineralExtension)

    assignPrototype(StructureLab, LabExtension)
    assignPrototype(StructureLink, LinkExtension)
    assignPrototype(StructureSpawn, SpawnExtension)
    assignPrototype(StructureTower, TowerExtension)
    assignPrototype(StructurePowerSpawn, PowerSpawnExtension)

    processFlagPos('infoPos', 'infoPos')
    processFlagPos('managerPos', 'managerPos')
    // processFlagPos('centerPos', 'centerPos')

    processFlagStructure('lab1', 'sourceLab1')
    processFlagStructure('lab2', 'sourceLab2')
    processFlagStructure('repairTower', 'towerAllowRepair')
}
