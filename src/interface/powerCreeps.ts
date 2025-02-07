// PowerCreep函数定义
interface PowerCreep {
    takeOps(): void
    isRoomHaveOps(): boolean
    isPowerAvailable(power: PowerConstant): boolean
}

interface PowerCreepMemory {
    needRenew: boolean
}
