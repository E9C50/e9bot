import './utils/BetterMove'
import './utils/RoomResource'
import './utils/StructureCache'

import { mountPrototype } from "prototype";
import { ErrorMapper } from "utils/ErrorMapper";

export const loop = ErrorMapper.wrapLoop(() => {

    mountPrototype()

    Object.values(Game.rooms).forEach(room => room.exec())
    Object.values(Game.creeps).forEach(creep => creep.exec())
    Object.values(Game.powerCreeps).forEach(powerCreep => powerCreep.exec())
})