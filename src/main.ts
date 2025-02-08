import './utils/BetterMove'
import './utils/RoomResource'
import './utils/StructureCache'

import { mountPrototype } from "prototype";
import { ErrorMapper } from "utils/ErrorMapper";

export const loop = ErrorMapper.wrapLoop(() => {

    // 挂载原型
    mountPrototype()

    // 房间初始化
    Object.values(Game.rooms).forEach(room => room.init())

    // 房间、爬工作
    Object.values(Game.rooms).forEach(room => room.exec())
    Object.values(Game.creeps).forEach(creep => creep.exec())
    Object.values(Game.powerCreeps).forEach(powerCreep => powerCreep.exec())
})