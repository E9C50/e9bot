export const loop = function () {
  console.log(Game.time)
}

console.log(`脚本初始化... Tick[${Game.time}] CPU[${Game.cpu.getUsed().toFixed(4)}] Bucket[${Game.cpu.bucket}]`)
