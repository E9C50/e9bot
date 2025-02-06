import { roleAdvEnum, roleBaseEnum } from "settings"
import { getClosestLineTarget, getClosestTarget, getDistance } from "utils"

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return true
    },
    prepare(creep) {
        return creep.goBoost()
    },
    source(creep) {
        // 如果没有空余容量了，就开始工作
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true
            return false
        }

        const creepData: RemoteFillerData = data as RemoteFillerData
        const sourceFlag: Flag = Game.flags[creepData.sourceFlag]
        const targetFlag: Flag = Game.flags[creepData.targetFlag]
        const sourceTarget = Game.getObjectById(creepData.sourceFlag) as Source
        const sourcePos = sourceFlag?.pos || sourceTarget?.pos

        if (sourcePos == undefined) return true

        // if (creep.pickupDroppedResource(true, 50)) return true

        // 如果不在目标房间，则去往目标房间
        if (creep.room.name != sourcePos.roomName) {
            creep.moveTo(sourcePos)
            return true
        }

        if (creep.room.my && creep.hits < creep.hitsMax && creep.room.towers.length > 0) creep.room.towers[0].heal(creep)

        // 如果身上不止有能量，则搬运到Storage
        // if (creep.room.storage != undefined && Object.keys(creep.store).filter(key => key != RESOURCE_ENERGY).length > 0) {
        //     if (getDistance(creep.pos, creep.room.storage.pos) > 1) {
        //         creep.moveTo(creep.room.storage)
        //         return true
        //     }
        //     creep.transfer(creep.room.storage, Object.keys(creep.store)[0] as ResourceConstant)
        //     return true
        // }

        var withdrawTarget: Structure | undefined = undefined
        var withdrawResource: ResourceConstant | undefined = undefined

        // 如果有缓存建筑，就去拿缓存
        if (creepData.withdrawTarget != undefined) {
            withdrawTarget = Game.getObjectById(creepData.withdrawTarget) as Structure
            withdrawResource = Object.keys(withdrawTarget['store'])[0] as ResourceConstant
        }

        if (creep.room.my && creep.room.level == 8) {
            withdrawTarget = creep.room.terminal || creep.room.storage
            withdrawResource = RESOURCE_ENERGY
        }

        // 如果有PowerBank就去捡
        if ((withdrawTarget == undefined || withdrawResource == undefined)
            && creep.room.powerBanks.length > 0 && creep.room.powerBanks[0].hits == 0) {
            withdrawTarget = creep.room.powerBanks[0]
            withdrawResource = RESOURCE_POWER
        }

        // 如果有Terminal并且有资源就去捡
        if ((withdrawTarget == undefined || withdrawResource == undefined)
            && creep.room.terminal != undefined && creep.room.terminal.store.getUsedCapacity() > 0) {
            const firstResourceType = Object.keys(creep.room.terminal.store)[0] as ResourceConstant
            withdrawTarget = creep.room.terminal
            withdrawResource = firstResourceType
        }

        // 如果有Factory并且有资源就去捡
        if ((withdrawTarget == undefined || withdrawResource == undefined)
            && creep.room.factory != undefined && creep.room.factory.store.getUsedCapacity() > 0) {
            const firstResourceType = Object.keys(creep.room.factory.store)[0] as ResourceConstant
            withdrawTarget = creep.room.factory
            withdrawResource = firstResourceType
        }

        // 如果有Storage并且有资源就去捡
        if ((withdrawTarget == undefined || withdrawResource == undefined)
            && creep.room.storage != undefined && creep.room.storage.store.getUsedCapacity() > 0) {
            const firstResourceType = Object.keys(creep.room.storage.store)[0] as ResourceConstant
            withdrawTarget = creep.room.storage
            withdrawResource = firstResourceType
        }

        // 如果有Spawns并且有资源就去捡
        if ((withdrawTarget == undefined || withdrawResource == undefined)) {
            const spawns = creep.room.spawns.filter(spawn => spawn.store[RESOURCE_ENERGY] > 0)
            if (spawns.length > 0) {
                withdrawTarget = getClosestTarget(creep.pos, spawns)
                withdrawResource = RESOURCE_ENERGY
            }
        }

        // 如果有Extensions并且有资源就去捡
        if ((withdrawTarget == undefined || withdrawResource == undefined)) {
            const extensions = creep.room.extensions.filter(extension => extension.store[RESOURCE_ENERGY] > 0)
            if (extensions.length > 0) {
                withdrawTarget = getClosestTarget(creep.pos, extensions)
                withdrawResource = RESOURCE_ENERGY
            }
        }

        // 如果有Containers并且有资源就去捡
        if ((withdrawTarget == undefined || withdrawResource == undefined)) {
            const containers = creep.room.containers.filter(container => container.store.getUsedCapacity() > 0)
            if (containers.length > 0) {
                const container = getClosestTarget(creep.pos, containers) as StructureContainer
                withdrawTarget = container
                withdrawResource = Object.keys(container.store)[0] as ResourceConstant
            }
        }

        if (withdrawTarget != undefined && withdrawResource != undefined) {
            if (getDistance(creep.pos, withdrawTarget.pos) > 1) {
                creep.moveTo(withdrawTarget)
                creepData.withdrawTarget = withdrawTarget.id
            } else {
                creep.withdraw(withdrawTarget, withdrawResource)
                creepData.withdrawTarget = undefined
            }
            return true
        }

        // powerbank还没好就过去等
        if (creep.room.powerBanks.length > 0 && getDistance(creep.pos, creep.room.powerBanks[0].pos) > 5) {
            creep.moveTo(creep.room.powerBanks[0])
            return true
        }

        if (creep.store.getUsedCapacity() > 0) {
            creep.memory.working = true
            return false
        }

        if (creep.room.sources.length > 0 && getDistance(creep.room.sources[0].pos, creep.pos) > 3) {
            creep.moveTo(creep.room.sources[0])
        }

        creep.say("💤")
        return true
    },
    target(creep) {
        // 如果没有资源了，就切换为采集状态
        if (creep.store.getUsedCapacity() == 0) {
            creep.memory.working = false
            return false
        }

        const creepData: RemoteFillerData = data as RemoteFillerData
        const targetFlag: Flag = Game.flags[creepData.targetFlag]
        const targetTarget = Game.getObjectById(creepData.targetFlag) as Structure
        const targetPos = targetFlag?.pos || targetTarget?.pos

        if (targetPos == undefined) {
            creep.say('❓')
            return true
        }

        if (creep.room.name != targetPos.roomName) {
            creep.moveTo(targetPos, { visualizePathStyle: {} })
            return true
        }

        if (creep.room.my && creep.hits < creep.hitsMax && creep.room.towers.length > 0) creep.room.towers[0].heal(creep)

        // 如果身上不止有能量，则搬运到Storage
        if (creep.room.storage != undefined && Object.keys(creep.store).filter(key => key != RESOURCE_ENERGY).length > 0) {
            if (getDistance(creep.pos, creep.room.storage.pos) > 1) {
                creep.moveTo(creep.room.storage)
                return true
            }
            creep.transfer(creep.room.storage, Object.keys(creep.store)[0] as ResourceConstant)
            return true
        }

        // 搬运到最近的storage、link、container
        var targetStructure;
        const structureList: Structure[] = [
            creep.room.storage, ...creep.room.links, ...creep.room.containers,
            ...creep.room.towers, ...creep.room.spawns, ...creep.room.extensions
        ].filter(item => item != undefined && item.store.getFreeCapacity(RESOURCE_ENERGY) > 0) as Structure[]
        if (structureList.length > 0) {
            targetStructure = getClosestLineTarget(creep.pos, structureList)
        }

        if (targetStructure == undefined) {
            targetStructure = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: creep => creep.memory.role == roleAdvEnum.RBUILDER ||
                    creep.memory.role == roleBaseEnum.BUILDER || creep.memory.role == roleBaseEnum.UPGRADER
            })
        }

        if (targetStructure == undefined && creep.room.sources.length > 0) {
            creep.moveTo(creep.room.sources[0])
            return true
        }

        if (getDistance(creep.pos, targetStructure.pos) > 1) {
            creep.moveTo(targetStructure)
            return true
        }

        if (targetStructure) {
            creep.transfer(targetStructure, RESOURCE_ENERGY)
        }
        return true
    },
})
