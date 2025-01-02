import { mountWork } from "mount"
import { ErrorMapper } from "./utils/ErrorMapper"
import { creepNumberController, creepWorkController } from "./module/CreepController"
import { structureWorkController } from "./module/StructureController"
import { visualController } from "./module/VisualController"

export const loop = ErrorMapper.wrapLoop(() => {
  // console.log(`Current game tick is ${Game.time}`)

  // 挂载原型
  mountWork()

  // Creep数量控制
  creepNumberController()

  // Creep工作控制
  creepWorkController()

  // 建筑工作控制
  structureWorkController()

  // 可视化信息
  visualController()

  // Object.values(Game.creeps).forEach(creep => {
  //   creep.suicide()
  // })

})
