import { mountWork } from "mount"
import { ErrorMapper } from "./module/ErrorMapper"
import { creepController } from "./module/CreepController"
import { structureController } from "./module/StructureController"

export const loop = ErrorMapper.wrapLoop(() => {
  // console.log(`Current game tick is ${Game.time}`)

  // 挂载原型
  mountWork()

  // Creep数量控制
  creepController()

  // 建筑工作控制
  structureController()

})
