import creepWork from "roles";
import { CreepRoleConfig } from "settings/creeps"

export default class RoomExtension extends Room {
    public init(): void {
        this.initMemory()
        this.statsCreepCount()
    }

    public exec(): void {
        if (!this.my) return
        this.releaseCreep();

        [...this.spawn, ...this.tower].forEach(structure => structure.exec())
    }

    private initMemory() {
        if (global.SpawnQueue == undefined) global.SpawnQueue = {}
        if (global.SpawnQueue[this.name] == undefined) global.SpawnQueue[this.name] = []

        if (this.memory.harvestConfig == undefined) this.memory.harvestConfig = {}

        this.creepCounts = Object.keys(CreepRoleConfig).reduce((acc, role) => ({ ...acc, [role]: 0 }), {} as { [roleName in CreepRoleConstant]: number });
    }

    private statsCreepCount() {
        Object.values(Game.creeps).forEach(creep => {
            if (creep.room.name == this.name) {
                this.creepCounts[creep.memory.role] += 1
            }
        })
        global.SpawnQueue[this.name].forEach(data => {
            this.creepCounts[data.creepRole] += 1
        });
    }

    private releaseCreep(): void {
        Object.keys(CreepRoleConfig).forEach(creepRole => {
            const spawnData = creepWork[creepRole](creepRole, {}).spawnCheck(this, this.creepCounts[creepRole])
            if (spawnData != undefined) {
                global.SpawnQueue[this.name].push(spawnData)
            }
        })

        global.SpawnQueue[this.name] = global.SpawnQueue[this.name].sort((a, b) =>
            CreepRoleConfig[a.creepRole].priority - CreepRoleConfig[b.creepRole].priority
        )
    }
}