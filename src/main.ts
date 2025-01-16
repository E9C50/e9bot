import './utils/BetterMove'

import { mountWork } from "mount"
import { profile } from './utils/CodeProfiler'
import { ErrorMapper } from "./utils/ErrorMapper"
import { exportStats } from "./utils/ExportStats"
import { roomController } from './module/RoomController'
import { visualController } from "./module/VisualController"
import { obScannerController } from './module/ObserverController'
import { structureWorkController } from "./module/StructureController"
import { creepNumberController, creepWorkController } from "./module/CreepController"

profile.profileEnable();

export const loop = ErrorMapper.wrapLoop(() => {
  profile.profileWrap(function () {
    const debug = false && Game.shard.name == 'shard3'
    const cpuInit = Game.cpu.getUsed()
    var cpu = Game.cpu.getUsed()
    // 挂载原型
    mountWork()

    if (debug) console.log(`挂载原型 CPU 使用量：${(Game.cpu.getUsed() - cpu).toFixed(2)}`)
    cpu = Game.cpu.getUsed()

    // 房间自动化配置
    roomController()

    if (debug) console.log(`房间自动化配置 CPU 使用量：${(Game.cpu.getUsed() - cpu).toFixed(2)}`)
    cpu = Game.cpu.getUsed()

    // Creep 数量控制
    creepNumberController()

    if (debug) console.log(`Creep 数量控制 CPU 使用量：${(Game.cpu.getUsed() - cpu).toFixed(2)}`)
    cpu = Game.cpu.getUsed()

    // Creep 工作控制
    creepWorkController()

    if (debug) console.log(`Creep 工作控制 CPU 使用量：${(Game.cpu.getUsed() - cpu).toFixed(2)}`)
    cpu = Game.cpu.getUsed()

    // 建筑工作控制
    structureWorkController()

    if (debug) console.log(`建筑工作控制 CPU 使用量：${(Game.cpu.getUsed() - cpu).toFixed(2)}`)
    cpu = Game.cpu.getUsed()

    // 扫描指定房间
    obScannerController()

    if (debug) console.log(`扫描指定房间 CPU 使用量：${(Game.cpu.getUsed() - cpu).toFixed(2)}`)
    cpu = Game.cpu.getUsed()

    // 可视化信息
    visualController()

    if (debug) console.log(`可视化信息 CPU 使用量：${(Game.cpu.getUsed() - cpu).toFixed(2)}`)
    cpu = Game.cpu.getUsed()

    // 导出统计数据
    exportStats()

    if (debug) console.log(`导出统计数据 CPU 使用量：${(Game.cpu.getUsed() - cpu).toFixed(2)}`)
    cpu = Game.cpu.getUsed()

    if (debug) console.log(`Creeps 数量：${Object.keys(Game.creeps).length}`)
    if (debug) console.log(`总 CPU 使用量：${(Game.cpu.getUsed() - cpuInit).toFixed(2)}`)
    if (debug) console.log('------------------------------------------------')
  });

  // 利用空闲CPU生成Pixel
  if (typeof Game.cpu.generatePixel === 'function') {
    Game.cpu.generatePixel();
  }
})

console.log(`脚本初始化... Tick[${Game.time}] CPU[${Game.cpu.getUsed().toFixed(4)}] Bucket[${Game.cpu.bucket}]`)
