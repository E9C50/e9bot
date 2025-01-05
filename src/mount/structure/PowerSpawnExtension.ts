import { getRoomResourceByType } from "utils"

export default class PowerSpawnExtension extends StructurePowerSpawn {
    public doWork(): void {
        if (getRoomResourceByType(this.room, RESOURCE_ENERGY) > 800000 &&
            this.store[RESOURCE_ENERGY] >= 50 && this.store[RESOURCE_POWER] >= 1) {
            this.processPower()
        }
    }
}
