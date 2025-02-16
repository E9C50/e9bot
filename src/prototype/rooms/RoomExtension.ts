import creepWork from "roles";
import { CreepRoleConfig } from "settings/creeps"
import { BindRoomGlobalProperty, BindRoomMemoryProperty } from "utils/PrototypeBinds";

export default class RoomExtension extends Room {
    @BindRoomGlobalProperty
    public spawnQueue!: CreepSpawnData[]

    @BindRoomMemoryProperty
    public harvestConfig!: { [sourceId: string]: string[] }

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
        if (this.spawnQueue == undefined) this.spawnQueue = []
        if (this.harvestConfig == undefined) this.harvestConfig = {}

        this.creepCounts = Object.keys(CreepRoleConfig).reduce((acc, role) => ({ ...acc, [role]: 0 }), {} as { [roleName in CreepRoleConstant]: number });
    }

    private statsCreepCount() {
        Object.values(Game.creeps).forEach(creep => {
            if (creep.room.name == this.name) {
                this.creepCounts[creep.memory.role] += 1
            }
        })
        this.spawnQueue.forEach(data => {
            this.creepCounts[data.creepRole] += 1
        });
    }

    private releaseCreep(): void {
        Object.keys(CreepRoleConfig).forEach(creepRole => {
            const spawnData = creepWork[creepRole](creepRole, {}).spawnCheck(this, this.creepCounts[creepRole])
            if (spawnData != undefined) {
                this.spawnQueue.push(spawnData)
            }
        })

        this.spawnQueue = this.spawnQueue.sort((a, b) =>
            CreepRoleConfig[a.creepRole].priority - CreepRoleConfig[b.creepRole].priority
        )
    }


}