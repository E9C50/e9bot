export default class LinkExtension extends StructureLink {
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

        // 如果中央link有多余10的空间，就把能量转移到中央link
        if (centerLink && centerLink.store.getFreeCapacity(RESOURCE_ENERGY) > 10) {
            this.transferEnergy(centerLink)
        }
    }
}
