export default class CreepFiller extends Creep {
    public doWork(): void {
        const creepData: FillerData = this.memory.data as FillerData
        const sourceTarget: Structure = Game.getObjectById(creepData.sourceId) as Structure

        if (!this.memory.working && this.withdraw(sourceTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(sourceTarget);
        }

        if (this.store.getFreeCapacity() == 0) {
            this.memory.working = true
        }

        const targets = [...this.room.spawns, ...this.room.extensions, ...(this.room.storage ? [this.room.storage] : [])]
            .filter(item => item.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
        const transferTarget = targets.sort((a, b) => this.pos.getRangeTo(a) - this.pos.getRangeTo(b))[0];

        if (this.memory.working && this.transfer(transferTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(transferTarget);
        }

        if (this.store[RESOURCE_ENERGY] == 0) {
            this.memory.working = false
        }
    }
}
