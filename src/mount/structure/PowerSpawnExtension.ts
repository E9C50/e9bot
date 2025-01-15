export default class PowerSpawnExtension extends StructurePowerSpawn {
    public init(): void {
        if (!this.room.memory.roomFillJob.powerSpawnEnergy && this.store.getFreeCapacity(RESOURCE_ENERGY) > 1000) {
            this.room.memory.roomFillJob.powerSpawnEnergy = true
        }
        if (!this.room.memory.roomFillJob.powerSpawnPower && this.store.getFreeCapacity(RESOURCE_POWER) > 90) {
            this.room.memory.roomFillJob.powerSpawnPower = true
        }
    }
    public doWork(): void {
        if (this.room.memory.resourceAmount[RESOURCE_ENERGY] > 100000 &&
            this.store[RESOURCE_ENERGY] >= 50 && this.store[RESOURCE_POWER] >= 1) {
            this.processPower()
        }
    }
}
