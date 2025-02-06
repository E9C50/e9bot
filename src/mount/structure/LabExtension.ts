import { reactionSource } from "settings";

export default class LabExtension extends StructureLab {
    private labReactionWork(): void {
        // 如果Lab冷却中，就跳过
        if (this.cooldown != 0) return

        const sourceLab1 = this.room.memory.roomLabConfig.sourceLab1
        const sourceLab2 = this.room.memory.roomLabConfig.sourceLab2
        // 如果房间没有配置好两个sourceLab，就跳过
        if (sourceLab1 == undefined || sourceLab2 == undefined) return

        // 如果是sourceLab，就跳过
        if (this.id == sourceLab1 || this.id == sourceLab2) return

        // 获取两个lab
        const lab1 = Game.getObjectById(sourceLab1) as StructureLab;
        const lab2 = Game.getObjectById(sourceLab2) as StructureLab;

        // 如果两个lab中有一个没有物质，就跳过
        if (lab1.mineralType == undefined || lab2.mineralType == undefined) return

        // 如果Lab有物质，但是两个SourceLab的物质不匹配，就跳过
        const reactionSourceList = this.mineralType ? reactionSource[this.mineralType] : []

        if (this.mineralType != undefined &&
            (lab1.mineralType != undefined && lab1.mineralType != reactionSourceList[0]) &&
            (lab2.mineralType != undefined && lab2.mineralType != reactionSourceList[1])) return

        this.runReaction(lab1, lab2);
    }

    private labInJobExists(): boolean {
        let exists = false

        if (this.room.memory.roomFillJob.labInMineral != undefined) {
            this.room.memory.roomFillJob.labInMineral.forEach(labInJob => {
                if (labInJob.labId == this.id) {
                    exists = true
                    return
                }
            })
        }

        return exists
    }

    public init(): void {
        if (Game.time % 10 != 0) return
        if (this.room.memory.roomFillJob.labOut == undefined) this.room.memory.roomFillJob.labOut = []
        if (this.room.memory.roomFillJob.labInEnergy == undefined) this.room.memory.roomFillJob.labInEnergy = []
        if (this.room.memory.roomFillJob.labInMineral == undefined) this.room.memory.roomFillJob.labInMineral = []

        // 能量不够就请求能量
        if (this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            this.room.memory.roomFillJob.labInEnergy.push(this.id)
        }

        const labConfig = this.room.memory.roomLabConfig
        const thisLabConfig = labConfig.singleLabConfig[this.id]
        const boostMode = thisLabConfig != undefined && thisLabConfig.boostMode

        if (boostMode) {
            // 如果是boost模式，且boost配置的元素和当前元素不一致，就取出
            if (this.mineralType != undefined && thisLabConfig.resourceType != this.mineralType) {
                this.room.memory.roomFillJob.labOut.push(this.id)
            }

            // 如果是boost模式，并且资源不足就补充
            if (this.store[thisLabConfig.resourceType] < 3000) {
                const amount = this.room.getResource(thisLabConfig.resourceType, true, false, false, true)
                if (amount > 0 && !this.labInJobExists()) this.room.memory.roomFillJob.labInMineral.push({ labId: this.id, resourceType: thisLabConfig.resourceType })
            }
        } else {
            // 如果不是boost模式，并且不是sourceLab，那么超过1000，或者与当前配方不一致就取出
            if (this.id != labConfig.sourceLab1 && this.id != labConfig.sourceLab2
                && this.mineralType != undefined && labConfig.labReactionConfig != undefined
                && (this.store[this.mineralType] > 1000 || this.mineralType != labConfig.labReactionConfig)) {
                this.room.memory.roomFillJob.labOut.push(this.id)
            }

            // 如果不是boost模式，并且是sourceLab，并且和配置类型不一致，那就取出
            if (labConfig.labReactionConfig != undefined && (this.id == labConfig.sourceLab1 || this.id == labConfig.sourceLab2)) {
                const reactionConfig = reactionSource[labConfig.labReactionConfig]
                if ((this.id == labConfig.sourceLab1 && this.mineralType != undefined && this.mineralType != reactionConfig[0])
                    || this.id == labConfig.sourceLab2 && this.mineralType != undefined && this.mineralType != reactionConfig[1]) {
                    this.room.memory.roomFillJob.labOut.push(this.id)
                }
            }

            // 如果有反应配置，则处理sourceLab
            if (labConfig.labReactionConfig != undefined) {
                const reactionConfig = reactionSource[labConfig.labReactionConfig]
                const amount1 = this.room.getResource(reactionConfig[0], true, false, true, true)
                const amount2 = this.room.getResource(reactionConfig[1], true, false, true, true)

                if (this.id == labConfig.sourceLab1 && amount1 > 0 && (this.mineralType == undefined || this.store.getFreeCapacity(this.mineralType) > 1000) && !this.labInJobExists()) {
                    this.room.memory.roomFillJob.labInMineral.push({ labId: this.id, resourceType: reactionConfig[0] })
                }
                if (this.id == labConfig.sourceLab2 && amount2 > 0 && (this.mineralType == undefined || this.store.getFreeCapacity(this.mineralType) > 1000) && !this.labInJobExists()) {
                    this.room.memory.roomFillJob.labInMineral.push({ labId: this.id, resourceType: reactionConfig[1] })
                }
            }
        }
    }

    public doWork(): void {
        const thisLabConfig = this.room.memory.roomLabConfig.singleLabConfig[this.id]
        if (thisLabConfig == undefined || !thisLabConfig.boostMode) {
            this.labReactionWork()
        }
    }
}
