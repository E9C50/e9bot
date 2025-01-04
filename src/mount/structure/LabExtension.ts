import { reactionSource } from "constant";

export default class LabExtension extends StructureLab {
    public doWork(): void {
        // 如果Lab冷却中，就跳过
        if (this.cooldown != 0) return

        // 如果房间没有配置好两个sourceLab，就跳过
        if (!this.room.memory.sourceLab1 || !this.room.memory.sourceLab2) return
        if (this.id == this.room.memory.sourceLab1 || this.id == this.room.memory.sourceLab2) return

        // 获取两个lab
        const lab1 = Game.getObjectById(this.room.memory.sourceLab1) as StructureLab;
        const lab2 = Game.getObjectById(this.room.memory.sourceLab2) as StructureLab;

        // 如果Lab有物质，但是两个SourceLab的物质不匹配，就跳过
        const reactionSourceList = this.mineralType ? reactionSource[this.mineralType] : []
        if (this.mineralType != undefined &&
            (lab1.mineralType != undefined && !reactionSourceList.includes(lab1.mineralType)) &&
            (lab2.mineralType != undefined && !reactionSourceList.includes(lab2.mineralType))) {
            return
        }

        // 如果两个lab中有一个没有物质，就跳过
        if (lab1.mineralType == undefined || lab2.mineralType == undefined) return
        this.runReaction(lab1, lab2);
    }
}
