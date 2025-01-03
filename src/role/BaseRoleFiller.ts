export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return true
    },
    doWork: (creep: Creep) => {
        if (creep.pickupDroppedResource(true, 20)) return

        const creepData: FillerData = data as FillerData
        const sourceTarget = Game.getObjectById<Structure>(creepData.sourceId)

        if (!sourceTarget) {
            creep.say('❓')
            return
        }

        // 如果不是工作状态，就去采集
        if (!creep.memory.working && creep.withdraw(sourceTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sourceTarget);
        }

        // 如果没有空余容量了，就开始工作
        if (creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true
        }

        // 优先填充Spawn和Extension
        var targets: Structure[] = []
        targets = [...creep.room.spawns, ...creep.room.extensions].filter(item => item.store.getFreeCapacity(RESOURCE_ENERGY) > 0)

        // 如果没有Spawn和Extension需要填充，则填充Storage
        if (creep.room.storage && targets.length == 0 && creepData.sourceId != creep.room.storage.id) {
            targets = [creep.room.storage].filter(item => item.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
        }

        // 如果没有Storage需要填充，则填充Tower
        if (targets.length == 0) {
            targets = creep.room.towers.filter(item => item.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
        }

        // 如果没有Tower需要填充，则填充Lab
        if (targets.length == 0) {
            targets = creep.room.labs.filter(item => item.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
        }

        // 如果没有Lab需要填充，则填充Nuker
        if (targets.length == 0) {
            targets = creep.room.nuker ? [creep.room.nuker].filter(item => item.store.getFreeCapacity(RESOURCE_ENERGY) > 0) : []
        }

        // 如果有需要填充的目标 就填充
        var transferTarget: Structure = targets.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b))[0];
        const transferResult = creep.transfer(transferTarget, RESOURCE_ENERGY)
        if (creep.memory.working && transferResult == ERR_NOT_IN_RANGE) {
            creep.moveTo(transferTarget);
        }

        // 如果所有的都满了，就移动到Spawn等待
        if (creep.memory.working && transferResult != OK && transferResult != ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.spawns[0])
        }

        // 如果携带了除了能量之外的资源，就把它们都放到Storage里
        if (creep.room.storage && creep.store.getUsedCapacity() > creep.store.getUsedCapacity(RESOURCE_ENERGY)) {
            if (creep.transfer(creep.room.storage, Object.keys(creep.store).filter(item => item != RESOURCE_ENERGY)[0] as ResourceConstant) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage)
            }
        }

        // 如果是工作状态，但是没有能量了，就切换为采集状态
        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false
        }

        // 设置creep的表情
        if (creep.memory.working) {
            creep.say('📦')
        } else {
            creep.say('🈳')
        }
    },
})
