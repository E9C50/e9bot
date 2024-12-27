import { ErrorMapper } from "module/ErrorMapper"
import { mountWork } from "mount"
import { creepNumberController } from "./module/creepController"

export const loop = ErrorMapper.wrapLoop(() => {
  // console.log(`Current game tick is ${Game.time}`)

  // 挂载原型
  mountWork()

  // Creep数量控制
  creepNumberController()

})
