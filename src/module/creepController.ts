import { roleAdvEnum, roleBaseEnum } from "constant";
import { sha1String } from "utils";
import roles from 'role'

/**
 * 添加需求配置
 * @param room
 * @param creepRole
 * @param creepName
 * @param creepMemory
 * @returns
 */
function addCreepConfig(room: Room, creepRole: CreepRoleConstant, creepName: string, creepData: CreepData = {}, priority: number = 0): void {
    const creepNameHash = creepRole + '_' + sha1String(creepName)
    if (creepNameHash in room.memory.creepConfig) return

    room.memory.creepConfig[creepNameHash] = {
        role: creepRole,
        working: false,
        ready: false,
        spawnRoom: room.name,
        spawnPriority: priority,
        data: creepData
    }
}

/**
 * 检查房间信息，发布对应Creep需求
 */
function releaseCreepConfig(): void {
    for (const roomName in Game.rooms) {
        const room: Room = Game.rooms[roomName];
        if (!room.my) continue;
        room.memory.creepConfig = {}

        // 根据矿产情况发布矿工
        room.sources.forEach(source => {
            let canHarvesterPos: number = source.freeSpaceCount;
            canHarvesterPos = Math.min(canHarvesterPos, 2);
            // 三级之后每个矿一个矿工
            if (room.level > 3) canHarvesterPos = 1;
            for (let i = 0; i < canHarvesterPos; i++) {
                const creepMemory: HarvesterData = { sourceId: source.id }
                const creepName: string = room.name + '_HARVESTER_' + source.id + '_' + i
                addCreepConfig(room, roleBaseEnum.HARVESTER, creepName, creepMemory, 9)
            }
        });

        // 如果有中央Link，则发布中央搬运者
        if (room.centerLink) {
            addCreepConfig(room, roleAdvEnum.MANAGER, room.name + '_MANAGER', 8)
        }

        // 如果有矿机，则发布一个元素矿矿工
        if (room.extractor && room.mineral.mineralAmount > 0) {
            addCreepConfig(room, roleBaseEnum.MINER, room.name + '_MINER', { sourceTarget: room.mineral.id })
        }

        // 循环所有Container，发布对应Creep
        room.containers.forEach(container => {
            const creepFillerMemory: FillerData = { sourceId: container.id }
            const creepFillerName0 = room.name + '_FILLER_CONTAINER_' + container.id + '_0'
            addCreepConfig(room, roleBaseEnum.FILLER, creepFillerName0, creepFillerMemory, 7);
            if (container.store[RESOURCE_ENERGY] > 1000 && room.energyAvailable < room.energyCapacityAvailable) {
                const creepFillerName1 = room.name + '_FILLER_CONTAINER_' + container.id + '_1'
                addCreepConfig(room, roleBaseEnum.FILLER, creepFillerName1, creepFillerMemory, 7);
            }

            if (!room.storage) {
                for (let i = 0; i < Math.floor(container.store[RESOURCE_ENERGY] / 500) + 1; i++) {
                    const creepWorkerMemory: WorkerData = { sourceId: container.id }
                    const creepUpgraderName = room.name + '_UPGRADER_CONTAINER_' + container.id + '_' + i
                    // const creepBuilderName = room.name + '_BUILDER_CONTAINER_' + container.id + '_' + i
                    // const creepRepairerName = room.name + '_REPAIRER_CONTAINER_' + container.id + '_' + i
                    addCreepConfig(room, roleBaseEnum.UPGRADER, creepUpgraderName, creepWorkerMemory, 6);
                    // addCreepConfig(room, roleBaseEnum.BUILDER, creepBuilderName, creepWorkerMemory, 6);
                    // addCreepConfig(room, roleBaseEnum.REPAIRER, creepRepairerName, creepWorkerMemory, 5);
                }
            }
        })
    }
}

/**
 * creep 的数量控制器
 * 负责发现死去的 creep 并检查其是否需要再次孵化
 *
 * @param intrval 搜索间隔
 */
export const creepController = function (): void {
    // 清除死亡的Creeps
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // 发布需求配置
    releaseCreepConfig()

    // 执行工作
    Object.values(Game.creeps).forEach(creep => {
        roles[creep.memory.role](creep.memory.data).doWork(creep)
    });

}
