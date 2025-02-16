import { CreepRoleConfig } from "settings/creeps"

export default class SpawnExtension extends StructureSpawn {
    public init(): void {

    }

    public exec(): void {
        if (this.spawning) return

        const creepSpawnQueue = this.room.spawnQueue

        // 如果队列中有creep，则进行孵化
        if (creepSpawnQueue != undefined && creepSpawnQueue.length > 0) {
            const spawnCreep = creepSpawnQueue[0]

            const creepMemory: CreepMemory = {
                role: spawnCreep.creepRole,
                data: spawnCreep.creepData,
                spawnRoom: this.room.name
            }

            const roleConfig = CreepRoleConfig[spawnCreep.creepRole]
            const creepName = generateName(roleConfig.roleCode)
            const bodyPart = spawnCreep.bodyPart

            const spawnResult = this.spawnCreep(bodyPart, creepName, { memory: creepMemory })
            if (spawnResult == OK) this.room.spawnQueue.shift()
        }
    }
}

function generateName(code: string): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789'
    let creepName = code + '#'

    creepName += characters[Math.floor(Math.random() * characters.length)]
    creepName += numbers[Math.floor(Math.random() * numbers.length)]
    creepName += characters[Math.floor(Math.random() * characters.length)]
    creepName += numbers[Math.floor(Math.random() * numbers.length)]

    if (Game.creeps[creepName] != undefined) return generateName(code)

    return creepName;
}