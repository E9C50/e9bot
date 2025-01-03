import './utils/BetterMove'

import { mountWork } from "mount"
import { profile } from './utils/CodeProfiler'
import { ErrorMapper } from "./utils/ErrorMapper"
import { exportStats } from "./utils/ExportStats"
import { visualController } from "./module/VisualController"
import { structureWorkController } from "./module/StructureController"
import { creepNumberController, creepWorkController } from "./module/CreepController"

profile.profileEnable();

export const loop = ErrorMapper.wrapLoop(() => {
  profile.profileWrap(function () {
    // 挂载原型
    mountWork()

    // Creep 数量控制
    creepNumberController()

    // Creep 工作控制
    creepWorkController()

    // 建筑工作控制
    structureWorkController()

    // 可视化信息
    visualController()

    // 导出统计数据
    exportStats()
  });
})
