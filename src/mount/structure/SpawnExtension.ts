import { bodyConfigs, roleAdvEnum, roleBaseEnum } from "settings"
import { getBodyConfig } from "utils"

export default class SpawnExtension extends StructureSpawn {
    public init(): void {
        if (!this.room.memory.roomFillJob.extension && this.room.energyAvailable < this.room.energyCapacityAvailable) {
            this.room.memory.roomFillJob.extension = true
        }
    }
    public doWork(): void {
        if (this.spawning) return

        const creepSpawnQueue = this.room.memory.creepSpawnQueue

        // 如果队列中有creep，则进行孵化
        if (creepSpawnQueue.length > 0) {
            const creepName = creepSpawnQueue[0]
            const creepMemory = this.room.memory.creepConfig[creepName]
            let bodyConfig = bodyConfigs[creepMemory.role];

            const forceSpawn = creepMemory.role == roleAdvEnum.MANAGER || creepMemory.role == roleBaseEnum.FILLER || creepMemory.role == roleBaseEnum.HARVESTER

            const bodyPart: BodyPartConstant[] = getBodyConfig(this.room, bodyConfig, forceSpawn);
            const spawnResult = this.spawnCreep(bodyPart, creepName, { memory: creepMemory })
            if (spawnResult == OK) creepSpawnQueue.shift()
        }
    }
}
