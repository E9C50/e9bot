import { CreepController } from 'modules/CreepModules';
import './utils/BetterMove'
import './utils/RoomResource'
import './utils/StructureCache'

import { MountPrototype } from "prototype";
import { ErrorMapper } from "utils/ErrorMapper";

// 挂载原型
MountPrototype()

export const loop = ErrorMapper.wrapLoop(() => {

    // 爬初始化
    CreepController()

    // 房间初始化
    Object.values(Game.rooms).forEach(room => room.init())

    // 房间、爬工作
    Object.values(Game.rooms).forEach(room => room.exec())
    Object.values(Game.creeps).forEach(creep => creep.exec())
    Object.values(Game.powerCreeps).forEach(powerCreep => powerCreep.exec())
})

console.log(`脚本初始化... Tick[${Game.time}] CPU[${Game.cpu.getUsed().toFixed(4)}] Bucket[${Game.cpu.bucket}]`)