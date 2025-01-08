import { getRoomResourceByType } from "utils"

export default class PowerSpawnExtension extends StructurePowerSpawn {
    public init(): void {
        if (!this.room.memory.roomFillJob.powerSpawnEnergy && this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            this.room.memory.roomFillJob.powerSpawnEnergy = true
        }
        if (!this.room.memory.roomFillJob.powerSpawnPower && this.store.getFreeCapacity(RESOURCE_POWER) > 0) {
            this.room.memory.roomFillJob.powerSpawnPower = true
        }
    }
    public doWork(): void {
        if (getRoomResourceByType(this.room, RESOURCE_ENERGY) > 500000 &&
            this.store[RESOURCE_ENERGY] >= 50 && this.store[RESOURCE_POWER] >= 1) {
            this.processPower()
        }
    }
}
