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

function processFlagPos(flagName: string, memoryKey: string): void {
    if (Game.flags[flagName] != undefined) {
        const roomName = Game.flags[flagName].pos.roomName;
        Game.rooms[roomName].memory.roomPosition[memoryKey] = Game.flags[flagName].pos;
        Game.flags[flagName].remove();
    }

    // if (Game.time % 100 == 0) {
    //     for (let roomName in Game.rooms) {
    //         if (!Game.rooms[roomName].my) return
    //         if (Game.flags[flagName] == undefined && Game.rooms[roomName].memory.roomPosition[memoryKey] == undefined) {
    //             console.log(`房间 [${roomName}] 请放置旗帜 ${flagName} 用于设置 ${memoryKey} 位置`)
    //         }
    //     }
    // }
}

function processFlagStructure(): void {
    if (Game.flags['repairTower'] != undefined) {
        const roomName = Game.flags['repairTower'].pos.roomName;
        Game.rooms[roomName].memory.roomStructurePos['towerAllowRepair'] = Game.flags['repairTower'].pos.lookFor(LOOK_STRUCTURES)[0].id;
        Game.flags['repairTower'].remove();
    }

    if (Game.flags['lab1'] != undefined) {
        const roomName = Game.flags['lab1'].pos.roomName;
        Game.rooms[roomName].memory.roomLabConfig.sourceLab1 = Game.flags['lab1'].pos.lookFor(LOOK_STRUCTURES)[0].id;
        Game.flags['lab1'].remove();
    }

    if (Game.flags['lab2'] != undefined) {
        const roomName = Game.flags['lab2'].pos.roomName;
        Game.rooms[roomName].memory.roomLabConfig.sourceLab2 = Game.flags['lab2'].pos.lookFor(LOOK_STRUCTURES)[0].id;
        Game.flags['lab2'].remove();
    }
}

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

    processFlagStructure()
}
