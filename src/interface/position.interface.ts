interface RoomPosition {
    getFreeSpace(): RoomPosition[]
    directionToPos(direction: DirectionConstant): RoomPosition | undefined

    getDistance<T extends Creep | Structure | ConstructionSite>(target: T): number
    getLineDistance<T extends Creep | Structure | ConstructionSite>(target: T): number

    getClosestTarget<T extends Creep | Structure | ConstructionSite>(targetList: T[]): T
    getClosestLineTarget<T extends Creep | Structure | ConstructionSite>(targetList: T[]): T
}