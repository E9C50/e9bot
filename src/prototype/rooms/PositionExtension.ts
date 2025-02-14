export default class PositionExtension extends RoomPosition {
    /**
     * 获取该位置周围的开采位空位
     * @returns
     */
    public getFreeSpace(): RoomPosition[] {
        const terrain = new Room.Terrain(this.roomName)
        const result: RoomPosition[] = []

        const xs = [this.x - 1, this.x, this.x + 1]
        const ys = [this.y - 1, this.y, this.y + 1]

        // 遍历 x 和 y 坐标
        xs.forEach(x => ys.forEach(y => {
            // 如果不是墙则 ++
            if (terrain.get(x, y) != TERRAIN_MASK_WALL) result.push(new RoomPosition(x, y, this.roomName))
        }))

        return result
    }

    /**
     * 获取当前位置目标方向的 pos 对象
     * @param direction
     * @returns
     */
    public directionToPos(direction: DirectionConstant): RoomPosition | undefined {
        let targetX = this.x
        let targetY = this.y

        // 纵轴移动，方向朝下就 y ++，否则就 y --
        if (direction !== LEFT && direction !== RIGHT) {
            if (direction > LEFT || direction < RIGHT) targetY--
            else targetY++
        }
        // 横轴移动，方向朝右就 x ++，否则就 x --
        if (direction !== TOP && direction !== BOTTOM) {
            if (direction < BOTTOM) targetX++
            else targetX--
        }

        // 如果要移动到另一个房间的话就返回空，否则返回目标 pos
        if (targetX < 0 || targetY > 49 || targetX > 49 || targetY < 0) return undefined
        else return new RoomPosition(targetX, targetY, this.roomName)
    }

    /**
     * 获取到target的距离（切比雪夫距离）
     * @param pos1
     * @param pos2
     * @returns
     */
    public getDistance<T extends Creep | Structure | ConstructionSite>(target: T): number {
        return Math.max(Math.abs(this.x - target.pos.x), Math.abs(this.y - target.pos.y))
    }

    /**
     * 获取到target的距离（欧几里得距离）
     * @param target 
     * @returns 
     */
    public getLineDistance<T extends Creep | Structure | ConstructionSite>(target: T): number {
        const dx = this.x - target.pos.x; // x 方向差值
        const dy = this.y - target.pos.y; // y 方向差值
        return Math.sqrt(dx * dx + dy * dy); // 欧几里得距离
    }

    /**
     * 寻找最近的目标（切比雪夫距离）
     * @param source
     * @param targetList
     * @returns
     */
    public getClosestTarget<T extends Creep | Structure | ConstructionSite>(targetList: T[]): T {
        let closest: T = targetList[0]
        let minRange: number = Infinity

        for (let index in targetList) {
            let targetRange = this.getDistance(targetList[index])
            if (targetRange < minRange) {
                minRange = targetRange
                closest = targetList[index]
            }
        }

        return closest
    }

    /**
     * 寻找最近的目标（欧几里得距离）
     * @param source
     * @param targetList
     * @returns
     */
    public getClosestLineTarget<T extends Creep | Structure | ConstructionSite>(targetList: T[]): T {
        let closest: T = targetList[0]
        let minRange: number = Infinity

        for (let index in targetList) {
            let targetRange = this.getLineDistance(targetList[index])
            if (targetRange < minRange) {
                minRange = targetRange
                closest = targetList[index]
            }
        }

        return closest
    }
}