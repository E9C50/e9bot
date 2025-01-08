import { sha1String } from "utils";
import roles from 'role'
import { roleAdvEnum, roleBaseEnum, roleWarEnum } from "settings";

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
    room.memory.creepConfig[creepNameHash] = {
        displayName: creepNameHash,
        name: creepName,
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
 *
 * _MANAGER             0
 * _HARVESTER_          1
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
function releaseBaseCreepConfig(): void {
    for (const roomName in Game.rooms) {
        const room: Room = Game.rooms[roomName];
        if (!room.my) continue;

        if (roles[roleAdvEnum.MANAGER]({}).isNeed(room, '')) {
            addCreepConfig(room, roleAdvEnum.MANAGER, room.name + '_MANAGER', {}, 0)
        }

        if (roles[roleAdvEnum.PROCESSER]({}).isNeed(room, '')) {
            addCreepConfig(room, roleAdvEnum.PROCESSER, room.name + '_PROCESSER', {}, 8)
        }

        const creepMemory: MineralData = { sourceId: room.mineral.id }
        if (roles[roleBaseEnum.MINER](creepMemory).isNeed(room, '')) {
            addCreepConfig(room, roleBaseEnum.MINER, room.name + '_MINER', creepMemory, 7)
        }

        // 根据矿产情况发布矿工
        room.sources.forEach(source => {
            let canHarvesterPos: number = source.freeSpaceCount;
            canHarvesterPos = Math.min(canHarvesterPos, 2);
            // 三级之后每个矿一个矿工
            if (room.level > 3) canHarvesterPos = 1;
            for (let i = 0; i < canHarvesterPos; i++) {
                const creepMemory: HarvesterData = { sourceId: source.id }
                const creepName: string = room.name + '_HARVESTER_' + source.id + '_' + i
                addCreepConfig(room, roleBaseEnum.HARVESTER, creepName, creepMemory, 1)
            }
        });

        // 如果有Storage，则发布Storage相关Creep
        if (room.storage) {
            // 每10000能量发布一个升级者
            if (room.level < 8 || (room.controller && room.controller.ticksToDowngrade < 150000)) {
                var upgradeCount = Math.floor(room.storage.store[RESOURCE_ENERGY] / 10000) + 1;
                if (room.controller && room.controller.level == 8) upgradeCount = 1;
                upgradeCount = Math.min(upgradeCount, 15);

                for (let i = 0; i < upgradeCount; i++) {
                    const creepMemory: UpgraderData = { sourceId: room.storage.id }
                    const creepName: string = room.name + '_UPGRADER_STORAGE_' + i
                    addCreepConfig(room, roleBaseEnum.UPGRADER, creepName, creepMemory, 4)
                }
            }

            // 发布一个填充者
            const creepFillerMemory: FillerData = { sourceId: room.storage.id }
            const creepFillerName0 = room.name + '_FILLER_STORAGE_0'
            addCreepConfig(room, roleBaseEnum.FILLER, creepFillerName0, creepFillerMemory, 3)

            // 如果extension数量大于20，则再发布一个填充者
            if (room.extensions.length > 20 && room.level < 8) {
                const creepFillerName1 = room.name + '_FILLER_STORAGE_1'
                addCreepConfig(room, roleBaseEnum.FILLER, creepFillerName1, creepFillerMemory, 3)
            }

            // 发布两个建造者
            const creepBuilderMemory: BuilderData = { sourceId: room.storage.id, buildTarget: '' }
            if (roles[roleBaseEnum.BUILDER](creepBuilderMemory).isNeed(room, '')) {
                const creepBuilderName0 = room.name + '_BUILDER_STORAGE_0'
                const creepBuilderName1 = room.name + '_BUILDER_STORAGE_1'
                addCreepConfig(room, roleBaseEnum.BUILDER, creepBuilderName0, creepBuilderMemory, 5)
                addCreepConfig(room, roleBaseEnum.BUILDER, creepBuilderName1, creepBuilderMemory, 5)
            }

            // 每100000能量发布一个修理工，8级以下只发布一个
            const creepRepairerMemory: RepairerData = { sourceId: room.storage.id, repairTarget: '' }
            if (roles[roleBaseEnum.REPAIRER](creepRepairerMemory).isNeed(room, '')) {
                var repairerCount = Math.floor(room.storage.store[RESOURCE_ENERGY] / 100000) + 1;
                if (room.controller && room.controller.level < 8) repairerCount = 1;
                if (room.memory.roomCustom.repairerCount == undefined) room.memory.roomCustom.repairerCount = 0
                repairerCount = Math.min(repairerCount, room.memory.roomCustom.repairerCount)
                for (let i = 0; i < repairerCount; i++) {
                    const creepRepairerName = room.name + '_REPAIRER_STORAGE' + i
                    addCreepConfig(room, roleBaseEnum.REPAIRER, creepRepairerName, creepRepairerMemory, 6)
                }
            }
        }

        // 循环所有Container，发布对应Creep
        room.containers.forEach(container => {
            const creepFillerMemory: FillerData = { sourceId: container.id }
            const creepFillerName0 = room.name + '_FILLER_CONTAINER_' + container.id + '_0'
            addCreepConfig(room, roleBaseEnum.FILLER, creepFillerName0, creepFillerMemory, 2);
            if (container.store[RESOURCE_ENERGY] > 1000 && room.storage != undefined) {
                const creepFillerName1 = room.name + '_FILLER_CONTAINER_' + container.id + '_1'
                addCreepConfig(room, roleBaseEnum.FILLER, creepFillerName1, creepFillerMemory, 2);
            }

            if (room.storage) return


            const creepBuilderMemory: BuilderData = { sourceId: container.id, buildTarget: '' }
            if (roles[roleBaseEnum.BUILDER](creepBuilderMemory).isNeed(room, '')) {
                const creepBuilderName = room.name + '_BUILDER_CONTAINER_' + container.id
                addCreepConfig(room, roleBaseEnum.BUILDER, creepBuilderName, creepBuilderMemory, 4);

                if (container.store[RESOURCE_ENERGY] > 1500) {
                    const creepBuilderName = room.name + '_BUILDER_CONTAINER_' + container.id + '_1'
                    addCreepConfig(room, roleBaseEnum.BUILDER, creepBuilderName, creepBuilderMemory, 4);
                }
            }

            const creepRepairerMemory: RepairerData = { sourceId: container.id, repairTarget: '' }
            if (roles[roleBaseEnum.REPAIRER](creepRepairerMemory).isNeed(room, '')) {
                const creepRepairerName = room.name + '_REPAIRER_CONTAINER_' + container.id
                addCreepConfig(room, roleBaseEnum.REPAIRER, creepRepairerName, creepRepairerMemory, 5);
            }

            if (room.level < 8) {
                for (let i = 0; i < container.store[RESOURCE_ENERGY] / 1000; i++) {
                    const creepUpgraderMemory: UpgraderData = { sourceId: container.id }
                    const creepUpgraderName = room.name + '_UPGRADER_CONTAINER_' + container.id + '_' + i
                    addCreepConfig(room, roleBaseEnum.UPGRADER, creepUpgraderName, creepUpgraderMemory, 3);
                }
            }
        })
    }
}


function releaseJobsCreepConfig(): void {
    for (const roomName in Game.rooms) {
        const room: Room = Game.rooms[roomName];
        if (!room.my) continue;

        const roomCustom = room.memory.roomCustom

        // 发布 attacker
        if (roomCustom.attacker != undefined) {
            roomCustom.attacker.forEach(flagName => {
                if (Game.flags[flagName] != undefined) {
                    const attackerMemory: AttackerData = { needBoost: false, targetFlag: flagName, team: undefined }
                    const creepName = room.name + '_ATTACKER_' + flagName
                    addCreepConfig(room, roleWarEnum.ATTACKER, creepName, attackerMemory, -1);
                }
            });
        }

        // 发布 healer
        if (roomCustom.healer != undefined) {
            roomCustom.healer.forEach(flagName => {
                if (Game.flags[flagName] != undefined) {
                    const healerMemory: HealerData = { needBoost: false, targetFlag: flagName, team: undefined }
                    const creepName = room.name + '_HEALER_' + flagName
                    addCreepConfig(room, roleWarEnum.HEALER, creepName, healerMemory, -1);
                }
            });
        }

        // 发布 integrate
        if (roomCustom.integrate != undefined) {
            roomCustom.integrate.forEach(flagName => {
                if (Game.flags[flagName] != undefined) {
                    const integrateMemory: IntegrateData = { needBoost: false, targetFlag: flagName, team: undefined }
                    const creepName = room.name + '_INTEGRATE_' + flagName
                    addCreepConfig(room, roleWarEnum.INTEGRATE, creepName, integrateMemory, -1);
                }
            });
        }

        // 发布新房占领
        if (roomCustom.claimer != undefined) {
            roomCustom.claimer.forEach(targetRoomName => {
                const targetRoom = Game.rooms[targetRoomName]
                if (targetRoom != undefined && targetRoom.controller?.my) return
                const claimerMemory: ReserverData = { targetRoom: targetRoomName }
                const creepName = room.name + '_CLAIMER_' + targetRoomName
                addCreepConfig(room, roleAdvEnum.CLAIMER, creepName, claimerMemory, 9);
            })
        }

        // 发布矿房预定工
        if (roomCustom.reserver != undefined) {
            roomCustom.reserver.forEach(targetRoomName => {
                const reserverMemory: ReserverData = { targetRoom: targetRoomName }
                const creepName = room.name + '_RESERVER_' + targetRoomName
                addCreepConfig(room, roleAdvEnum.RESERVER, creepName, reserverMemory, 8);
            })
        }

        // 发布外房搬运工
        if (roomCustom.remoteFiller != undefined) {
            const remoteFiller = roomCustom.remoteFiller
            Object.keys(roomCustom.remoteFiller).forEach(targetFlagName => {
                const sourceFlagName = remoteFiller[targetFlagName]
                if (Game.flags[sourceFlagName] != undefined && Game.flags[targetFlagName] != undefined) {
                    const remoteFillerMemory: RemoteFillerData = { sourceFlag: sourceFlagName, targetFlag: targetFlagName }
                    const creepName = room.name + '_RFILLER_' + sourceFlagName + '_' + targetFlagName
                    addCreepConfig(room, roleAdvEnum.RFILLER, creepName, remoteFillerMemory, 8);
                }
            });
        }

        // 发布外房建筑工
        if (roomCustom.remoteBuilder != undefined) {
            const remoteBuilder = roomCustom.remoteBuilder
            Object.keys(roomCustom.remoteBuilder).forEach(targetFlagName => {
                const sourceFlagName = remoteBuilder[targetFlagName]
                if (Game.flags[sourceFlagName] != undefined && Game.flags[targetFlagName] != undefined) {
                    const remoteBuilderMemory: RemoteBuilderData = { sourceFlag: sourceFlagName, targetFlag: targetFlagName }
                    const creepName = room.name + '_RBUILDER_' + sourceFlagName + '_' + targetFlagName
                    addCreepConfig(room, roleAdvEnum.RBUILDER, creepName, remoteBuilderMemory, 8);
                }
            });
        }

        // 发布外矿能量矿工
        if (roomCustom.remoteHarvester != undefined) {
            Object.keys(roomCustom.remoteHarvester).forEach(sourceId => {
                if (roomCustom.remoteHarvester == undefined) return
                const creepMemory: RemoteHarvesterData = { sourceId: sourceId, targetRoom: roomCustom.remoteHarvester[sourceId] }
                const creepNameHarvester: string = room.name + '_RHARVESTER_' + sourceId
                addCreepConfig(room, roleAdvEnum.RHARVESTER, creepNameHarvester, creepMemory, 9)
            })
        }
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

    if (Game.time % 10 != 0) return

    // 重置发布配置
    Object.values(Game.rooms).forEach(room => {
        room.memory.creepConfig = {}
    });

    // 发布基础需求配置
    releaseBaseCreepConfig()

    // 发布远程工作配置
    releaseJobsCreepConfig()
}

/**
 * Creep 的工作控制器
 */
export const creepWorkController = function (): void {
    if (Game.cpu.bucket < 20) return
    // 执行工作
    var workCpu: [string, number][] = []
    Object.values(Game.creeps).forEach(creep => {
        if (creep.spawning) return

        if (roles[creep.memory.role](creep.memory.data).prepare(creep)) {
            if (creep.memory.working) {
                const cpu = Game.cpu.getUsed()
                roles[creep.memory.role](creep.memory.data).target(creep)
                workCpu.push([creep.name, (Game.cpu.getUsed() - cpu)])
            } else {
                roles[creep.memory.role](creep.memory.data).source(creep)
            }
        }

    });

    // workCpu = workCpu.sort((a, b) => b[1] - a[1])
    // for (let role in Object.keys(workCpu)) {
    //     if (workCpu[role][1] > 0.5) {
    //         console.log(workCpu[role][1], workCpu[role][0])
    //     }
    // }

    // console.log('------------------------------------------------')
}
