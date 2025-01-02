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
    const creepNameHash = creepRole.toUpperCase() + '_' + sha1String(creepName)
    if (creepNameHash in room.memory.creepConfig) return

    // 判断是否需要发布
    if (roles[creepRole](creepData).isNeed(room, creepName)) {
        room.memory.creepConfig[creepNameHash] = {
            role: creepRole,
            working: false,
            ready: false,
            spawnRoom: room.name,
            spawnPriority: priority,
            data: creepData
        }
    }
}

/**
 * 检查房间信息，发布对应Creep需求
 *
 * _HARVESTER_          0
 * _MANAGER             1
 * _MINER               7
 *
 * _FILLER_STORAGE      3
 * _UPGRADER_STORAGE_   4
 * _BUILDER_STORAGE_    5
 * _REPAIRER_STORAGE    6
 *
 * _FILLER_CONTAINER_   2
 * _UPGRADER_CONTAINER_ 3
 * _BUILDER_CONTAINER_  4
 * _REPAIRER_CONTAINER_ 5
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
                addCreepConfig(room, roleBaseEnum.HARVESTER, creepName, creepMemory, 0)
            }
        });

        // 如果有中央Link，则发布中央搬运者
        if (room.centerLink) {
            addCreepConfig(room, roleAdvEnum.MANAGER, room.name + '_MANAGER', {}, 1)
        }

        // 如果有矿机，则发布一个元素矿矿工
        if (room.extractor && room.mineral.mineralAmount > 0) {
            addCreepConfig(room, roleBaseEnum.MINER, room.name + '_MINER', { sourceTarget: room.mineral.id }, 7)
        }

        // 如果有Storage，则发布Storage相关Creep
        if (room.storage) {
            // 每5000能量发布一个升级者
            var upgradeCount = Math.floor(room.storage.store[RESOURCE_ENERGY] / 5000) + 1;
            if (room.controller && room.controller.level == 8) upgradeCount = 1;
            upgradeCount = Math.min(upgradeCount, 15);

            for (let i = 0; i < upgradeCount; i++) {
                const creepMemory: UpgraderData = { sourceId: room.storage.id }
                const creepName: string = room.name + '_UPGRADER_STORAGE_' + i
                addCreepConfig(room, roleBaseEnum.UPGRADER, creepName, creepMemory, 4)
            }

            // 发布一个填充者
            const creepFillerMemory: FillerData = { sourceId: room.storage.id }
            const creepFillerName0 = room.name + '_FILLER_STORAGE_0'
            addCreepConfig(room, roleBaseEnum.FILLER, creepFillerName0, creepFillerMemory, 3)

            // 如果extension数量大于20，则再发布一个填充者
            if (room.extensions.length > 20) {
                const creepFillerName1 = room.name + '_FILLER_STORAGE_1'
                addCreepConfig(room, roleBaseEnum.FILLER, creepFillerName1, creepFillerMemory, 3)
            }

            // 发布两个建造者
            const creepBuilderMemory: BuilderData = { sourceId: room.storage.id }
            const creepBuilderName0 = room.name + '_BUILDER_STORAGE_0'
            const creepBuilderName1 = room.name + '_BUILDER_STORAGE_1'
            addCreepConfig(room, roleBaseEnum.BUILDER, creepBuilderName0, creepBuilderMemory, 5)
            addCreepConfig(room, roleBaseEnum.BUILDER, creepBuilderName1, creepBuilderMemory, 5)

            // 发布一个维修者
            const creepRepairerMemory: RepairerData = { sourceId: room.storage.id, repairTarget: '' }
            const creepRepairerName = room.name + '_REPAIRER_STORAGE'
            addCreepConfig(room, roleBaseEnum.REPAIRER, creepRepairerName, creepRepairerMemory, 6)
        }

        // 循环所有Container，发布对应Creep
        room.containers.forEach(container => {
            const creepFillerMemory: FillerData = { sourceId: container.id }
            const creepFillerName0 = room.name + '_FILLER_CONTAINER_' + container.id + '_0'
            addCreepConfig(room, roleBaseEnum.FILLER, creepFillerName0, creepFillerMemory, 2);
            if (container.store[RESOURCE_ENERGY] > 1000) {
                const creepFillerName1 = room.name + '_FILLER_CONTAINER_' + container.id + '_1'
                addCreepConfig(room, roleBaseEnum.FILLER, creepFillerName1, creepFillerMemory, 2);
            }

            if (room.storage) return

            const creepBuilderMemory: BuilderData = { sourceId: container.id }
            const creepBuilderName = room.name + '_BUILDER_CONTAINER_' + container.id
            addCreepConfig(room, roleBaseEnum.BUILDER, creepBuilderName, creepBuilderMemory, 4);

            const creepRepairerMemory: RepairerData = { sourceId: container.id, repairTarget: '' }
            const creepRepairerName = room.name + '_REPAIRER_CONTAINER_' + container.id
            addCreepConfig(room, roleBaseEnum.REPAIRER, creepRepairerName, creepRepairerMemory, 5);

            for (let i = 0; i < container.store[RESOURCE_ENERGY] / 1000; i++) {
                const creepUpgraderMemory: UpgraderData = { sourceId: container.id }
                const creepUpgraderName = room.name + '_UPGRADER_CONTAINER_' + container.id + '_' + i
                addCreepConfig(room, roleBaseEnum.UPGRADER, creepUpgraderName, creepUpgraderMemory, 3);
            }
        })
    }
}

/**
 * Creep 的数量控制器
 */
export const creepNumberController = function (): void {
    // 清除死亡的Creeps
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // 发布需求配置
    releaseCreepConfig()
}

/**
 * Creep 的工作控制器
 */
export const creepWorkController = function (): void {
    // 执行工作
    Object.values(Game.creeps).forEach(creep => {
        roles[creep.memory.role](creep.memory.data).doWork(creep)
    });
}
