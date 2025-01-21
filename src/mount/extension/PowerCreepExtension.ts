import { getDistance } from "utils";

export default class PowerCreepExtension extends PowerCreep {
    /**
     * 从指定地方取出OPS
     * @param takeTarget
     * @param resourceType
     * @param amount
     */
    public takeOps(): void {
        var takeTarget: AnyStoreStructure | undefined = undefined
        if (this.room == undefined) return
        if (this.room.storage != undefined && this.room.storage.store[RESOURCE_OPS] > 0) {
            takeTarget = this.room.storage
        }
        if (this.room.terminal != undefined && this.room.terminal.store[RESOURCE_OPS] > 0) {
            takeTarget = this.room.terminal
        }

        if (takeTarget == undefined) return
        if (getDistance(this.pos, takeTarget.pos) <= 1) {
            this.withdraw(takeTarget, RESOURCE_OPS)
        } else {
            this.moveTo(takeTarget)
        }
    }

    /**
     * 技能是否可用
     * @param power
     * @returns
     */
    public isPowerAvailable(power: PowerConstant): boolean {
        return this.room != undefined && this.room.controller != undefined && this.room.controller.isPowerEnabled
            && this.powers[power] != undefined && this.powers[power].level > 0 && this.powers[power].cooldown == 0
            && this.store[RESOURCE_OPS] > 0
    }

    /**
     * 房间内是否有可用的OPS
     * @returns
     */
    public isRoomHaveOps(): boolean {
        return this.room != undefined && (
            (this.room.storage != undefined && this.room.storage.store[RESOURCE_OPS] > 0)
            || (this.room.terminal != undefined && this.room.terminal.store[RESOURCE_OPS] > 0)
        )
    }
}
