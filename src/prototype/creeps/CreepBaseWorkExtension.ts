export default class CreepBaseWorkExtension extends Creep {
    public takeEnergy() {
        if (this.store.getFreeCapacity() == 0) {
            this.memory.working = true
            return
        }

        const storeStructure = this.room.mass_stores.filter(store => store.store[RESOURCE_ENERGY] > 0)
        const closestEnergy = this.pos.getClosestTarget(storeStructure)
        if (!this.pos.isNearTo(closestEnergy)) {
            this.moveTo(closestEnergy)
        } else {
            this.withdraw(closestEnergy, RESOURCE_ENERGY)
        }
        return
    }

    public doUpdateWork() {
        if (this.store[RESOURCE_ENERGY] == 0) {
            this.memory.working = false
            return
        }

        if (this.room.controller == undefined) return
        if (!this.pos.inRangeTo(this.room.controller, 3)) {
            this.moveTo(this.room.controller)
        } else {
            this.upgradeController(this.room.controller)
        }
    }

    public doBuildWork() {
        if (this.store[RESOURCE_ENERGY] == 0) {
            this.memory.working = false
            return
        }

        if (this.room.constructionSite.length == 0) return
        const closestSite = this.pos.getClosestTarget(this.room.constructionSite)
        if (!this.pos.inRangeTo(closestSite, 3)) {
            this.moveTo(closestSite)
        } else {
            this.build(closestSite)
        }
    }
}