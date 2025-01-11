import { reactionSource } from "settings";

export default class LabExtension extends StructureLab {
    private labReactionWork(): void {
        // 如果Lab冷却中，就跳过
        if (this.cooldown != 0) return

        // 如果房间没有配置好两个sourceLab，就跳过
        const sourceLab1 = this.room.memory.roomStructurePos.sourceLab1
        const sourceLab2 = this.room.memory.roomStructurePos.sourceLab2
        if (sourceLab1 == undefined || sourceLab2 == undefined) return
        if (this.id == sourceLab1 || this.id == sourceLab2) return

        // 获取两个lab
        const lab1 = Game.getObjectById(sourceLab1) as StructureLab;
        const lab2 = Game.getObjectById(sourceLab2) as StructureLab;

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

    private boostCreepWork(): void {
        if (this.room.memory.labBoostConfig == undefined) return
        if (this.room.memory.labBoostConfig[this.id] == undefined) return
        if (this.mineralType != this.room.memory.labBoostConfig[this.id].resourceType) return

        const labBoostBody = this.room.memory.labBoostConfig[this.id].bodyPart

        const nearbyCreeps = this.pos.findInRange(FIND_MY_CREEPS, 1)
        for (let name in nearbyCreeps) {
            let creep = nearbyCreeps[name]
            if (creep.memory.needBoost && creep.body.filter(body => !body.boost && body.type == labBoostBody).length > 0) {
                console.log(this.boostCreep(creep), this.mineralType)
                return
            }
        }
        return
    }

    public init(): void {
        if (this.room.memory.roomFillJob.labOut == undefined) this.room.memory.roomFillJob.labOut = []
        if (this.room.memory.roomFillJob.labInEnergy == undefined) this.room.memory.roomFillJob.labInEnergy = []
        if (this.room.memory.roomFillJob.labInMineral == undefined) this.room.memory.roomFillJob.labInMineral = []

        const labOut = this.room.memory.roomFillJob.labOut
        const labInEnergy = this.room.memory.roomFillJob.labInEnergy
        const labInMineral = this.room.memory.roomFillJob.labInMineral

        if (!labInEnergy.includes(this.id) && this.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            this.room.memory.roomFillJob.labInEnergy.push(this.id)
        }

        if (this.room.memory.roomCustom.labBoostMod && this.room.memory.labBoostConfig[this.id] == undefined) {
            if (this.mineralType != undefined) { this.room.memory.roomFillJob.labOut.push(this.id) }
            return
        }

        var targetType: MineralConstant | MineralCompoundConstant;
        const boostMode = this.room.memory.roomCustom.labBoostMod
        if (boostMode) {
            targetType = this.room.memory.labBoostConfig[this.id].resourceType
        } else {
            targetType = RESOURCE_GHODIUM
        }

        if (!labOut.includes(this.id) && this.mineralType != targetType && this.mineralType != undefined) {
            this.room.memory.roomFillJob.labOut.push(this.id)
        }

        if (!labInMineral.map(x => x.labId).includes(this.id) && this.store.getFreeCapacity(targetType) > 0
            && (this.room.memory.resourceAmount[targetType] - this.store[targetType]) > 0) {

            this.room.memory.roomFillJob.labInMineral.push({ labId: this.id, resourceType: targetType })
        }
    }

    public doWork(): void {
        if (this.room.memory.roomCustom.labBoostMod) {
            this.boostCreepWork()
        } else {
            this.labReactionWork()
        }
    }
}
