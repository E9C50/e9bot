import { ErrorMapper } from "utils/ErrorMapper"
import { mountWork } from "mount"

export const loop = ErrorMapper.wrapLoop(() => {
  // console.log(`Current game tick is ${Game.time}`)

  // 挂载原型
  mountWork()

})
