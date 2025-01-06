export default class LinkExtension extends StructureLink {
    private isSideLink(): boolean {
        return this.pos.x <= 3 || this.pos.x >= 47 || this.pos.y <= 3 || this.pos.y >= 47
    }
    public doWork(): void {
        const centerLink = this.room.centerLink
        const controllerLink = this.room.controllerLink
        if (centerLink == undefined) return

        // 处理CenterLink的逻辑
        if (this.id == centerLink.id) {
            return
        }

        // 处理ControllerLink的逻辑
        if (controllerLink && this.id == controllerLink.id) {
            return
        }

        // 符合条件就发送能量
        if (centerLink && centerLink.store.getFreeCapacity(RESOURCE_ENERGY) > 10) {
            if (this.isSideLink()) {
                if (this.store[RESOURCE_ENERGY] > 0) {
                    this.transferEnergy(centerLink)
                }
            } else {
                if (this.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                    this.transferEnergy(centerLink)
                }
            }
        }
    }
}
