export default class NukerExtension extends StructureNuker {
    public init(): void {
        if (!this.room.memory.roomFillJob.nukerEnergy && this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            this.room.memory.roomFillJob.nukerEnergy = true
        }
        if (!this.room.memory.roomFillJob.nukerMineral && this.store.getFreeCapacity(RESOURCE_GHODIUM) > 0) {
            this.room.memory.roomFillJob.nukerMineral = true
        }
    }
    public doWork(): void {

    }
}
