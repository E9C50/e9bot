import { ErrorMapper } from "utils/ErrorMapper"
import { mountWork } from "mount"

export const loop = ErrorMapper.wrapLoop(() => {
  // console.log(`Current game tick is ${Game.time}`)

  // 挂载原型
  mountWork()

  for (const name in Game.creeps) {
    const creep = Game.creeps[name]
    creep.getEnergyFrom(creep.room.sources[0])
    creep.buildStructure()
  }
})
