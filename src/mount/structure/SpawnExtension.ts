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

        // 循环creepConfig，筛选出未孵化的creep，并按照优先级排序
        const creepConfigCache = this.room.memory.creepConfig
        var creepSpawnQueue = Object.keys(creepConfigCache)
            .filter(creepName => !Game.creeps[creepName])
            .sort((a, b) => creepConfigCache[a].spawnPriority - creepConfigCache[b].spawnPriority)

        const fillers = Object.values(Game.creeps).filter(creep => creep.room.name == this.room.name && creep.memory.role == roleBaseEnum.FILLER)
        const harvesters = Object.values(Game.creeps).filter(creep => creep.room.name == this.room.name && creep.memory.role == roleBaseEnum.HARVESTER)

        // 如果有harvester，但是没有filler，则优先孵化一个对应的filler
        if (this.room.containers.length > 0 && fillers.length == 0 && harvesters.length > 0) {
            const container = this.room.containers.filter(container => container.store[RESOURCE_ENERGY] > 0)
            const highPriority = creepSpawnQueue.filter(creepName => creepConfigCache[creepName].role == roleBaseEnum.FILLER &&
                container.length > 0 && container[0].id == (creepConfigCache[creepName].data as FillerData).sourceId)[0]

            if (highPriority) {
                creepSpawnQueue = [highPriority, ...creepSpawnQueue.filter(creepName => creepName != highPriority)]
            }
        }

        // 如果没有harvester，则优先孵化一个对应的harvester
        if (harvesters.length == 0) {
            const highPriority = creepSpawnQueue.filter(creepName => creepConfigCache[creepName].role == roleBaseEnum.HARVESTER)[0]
            if (highPriority) {
                creepSpawnQueue = [highPriority, ...creepSpawnQueue.filter(creepName => creepName != highPriority)]
            }
        }

        this.room.memory.creepSpawnQueue = creepSpawnQueue

        // 如果队列中有creep，则进行孵化
        if (creepSpawnQueue.length > 0) {
            const creepName = creepSpawnQueue[0]
            const creepMemory = creepConfigCache[creepName]
            const forceSpawn = fillers.length == 0 || harvesters.length == 0 || creepMemory.role == roleAdvEnum.MANAGER

            var bodyConfig = bodyConfigs[creepMemory.role];

            const bodyPart: BodyPartConstant[] = getBodyConfig(this.room, bodyConfig, forceSpawn);
            const spawnResult = this.spawnCreep(bodyPart, creepName, { memory: creepMemory })
            if (spawnResult == OK) creepSpawnQueue.shift()
        }
    }
}
