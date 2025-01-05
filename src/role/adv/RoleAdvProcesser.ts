import { reactionSource } from "settings"

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        const processTask = room.memory.roomJobs.processTaksQueue.length > 0
        const reactionCheck = room.memory.structureIdList['sourceLab1'] != undefined && room.memory.structureIdList['sourceLab2'] != undefined
            && room.memory.labReactionQueue.length > 0
        return reactionCheck || processTask
    },
    doWork: (creep: Creep) => {
        const debug = false
        var result: ScreepsReturnCode = OK
        const room = creep.room
        const creepData = creep.memory.data as ProcesserData
        const reactionTarget = room.memory.labReactionQueue[0]
        const creepStore0 = Object.keys(creep.store)[0] as ResourceConstant

        // 如果核弹的G元素不足，并且仓库有G元素，就从仓库取出
        if (room.nuker && room.storage && room.nuker?.store.getFreeCapacity(RESOURCE_GHODIUM) > 0
            && (room.storage?.store[RESOURCE_GHODIUM] > 10000 || creep.store[RESOURCE_GHODIUM] == creep.store.getCapacity())) {
            if (debug) console.log('核弹G元素不足')
            if (creep.store[RESOURCE_GHODIUM] > 0) {
                result = creep.transfer(room.nuker, RESOURCE_GHODIUM)
                if (result == OK) return
                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(room.nuker)
                    if (debug) console.log('放入核弹G元素')
                    return
                }
            } else {
                result = creep.withdraw(room.storage, RESOURCE_GHODIUM)
                if (result == OK) return
                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(room.storage)
                    if (debug) console.log('从仓库取出G元素')
                    return
                }
            }
        }

        // 如果PowerSpawn的Power不足，并且仓库有Power，就从仓库取出
        if (room.powerSpawn && room.storage && room.powerSpawn.store.getFreeCapacity(RESOURCE_POWER) > 90
            && (room.storage?.store[RESOURCE_POWER] > 10000 || creep.store[RESOURCE_POWER] == creep.store.getCapacity())) {
            if (debug) console.log('补充Power')
            if (creep.store[RESOURCE_POWER] > 0) {
                result = creep.transfer(room.powerSpawn, RESOURCE_POWER)
                if (result == OK) return
                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(room.powerSpawn)
                    if (debug) console.log('搬运Power中')
                    return
                }
            } else {
                result = creep.withdraw(room.storage, RESOURCE_POWER, 100)
                if (result == OK) return
                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(room.storage)
                    if (debug) console.log('取出Power中')
                    return
                }
            }
        }

        // 处理Lab相关物流工作
        if (creep.room.memory.structureIdList['sourceLab1'] != undefined && creep.room.memory.structureIdList['sourceLab2'] != undefined) {

            const lab1 = Game.getObjectById(creep.room.memory.structureIdList['sourceLab1']) as StructureLab;
            const lab2 = Game.getObjectById(creep.room.memory.structureIdList['sourceLab2']) as StructureLab;

            const lab1MineralType = lab1.mineralType as ResourceConstant
            const lab2MineralType = lab2.mineralType as ResourceConstant

            var lab1FreeCapacity = lab1.store.getFreeCapacity(lab1MineralType)
            var lab2FreeCapacity = lab2.store.getFreeCapacity(lab2MineralType)

            lab1FreeCapacity = lab1FreeCapacity == undefined ? 3000 : lab1FreeCapacity
            lab2FreeCapacity = lab2FreeCapacity == undefined ? 3000 : lab2FreeCapacity

            // 获取当前房间的反应配置
            const reactionConfigList = reactionTarget ? reactionSource[reactionTarget] : []
            const reactionConfig1 = reactionConfigList[0] as ResourceConstant
            const reactionConfig2 = reactionConfigList[1] as ResourceConstant

            // 检查两个SourceLab的资源是否符合反应配置，如果不符合就清空
            if (lab1MineralType != undefined && lab1MineralType != reactionConfig1) {
                result = creep.withdraw(lab1, lab1MineralType)
                if (result == OK) return
                if (creep.store.getFreeCapacity() > 0 && result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(lab1)
                    if (debug) console.log('清空SourceLab1')
                    return
                }
            }
            if (lab2MineralType != undefined && lab2MineralType != reactionConfig2) {
                result = creep.withdraw(lab2, lab2MineralType)
                if (result == OK) return
                if (creep.store.getFreeCapacity() > 0 && result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(lab2)
                    if (debug) console.log('清空SourceLab2')
                    return
                }
            }

            // 查找最近的非Source的Lab，取出其中的资源，然后放到Storage中
            const lab = room.labs.filter(lab =>
                lab.id != room.memory.structureIdList['sourceLab1'] && lab.id != room.memory.structureIdList['sourceLab2'] && lab.mineralType != undefined && (
                    lab.store.getUsedCapacity(lab.mineralType) > 200 || lab.mineralType != reactionTarget
                )).sort((a, b) => b.store[b.mineralType as ResourceConstant] - a.store[a.mineralType as ResourceConstant])[0]

            if (lab) {
                const mineralType = lab.mineralType as ResourceConstant
                result = creep.withdraw(lab, mineralType)
                if (result == OK) return
                if (room.storage && creep.store.getFreeCapacity() > 0 && result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(lab)
                    if (debug) console.log('从产出Lab取出资源')
                    return
                }
                result = room.storage != undefined ? creep.transfer(room.storage, mineralType) : ERR_NOT_FOUND
                if (result == OK) return
                if (room.storage && creep.store.getFreeCapacity() == 0 && result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(room.storage)
                    if (debug) console.log('放入仓库')
                    return
                }
            }

            // 检查两个SourceLab是否有资源，如果有空余容量就从Storage中取出资源放入
            if (lab1FreeCapacity > 1600 && lab1FreeCapacity >= lab2FreeCapacity && ((reactionConfig1 == lab1MineralType && lab1FreeCapacity > 0) || lab1MineralType == undefined)) {
                if (creep.store.getUsedCapacity() > 0 && creepStore0 != reactionConfig1 && room.storage != undefined) {
                    result = room.storage != undefined ? creep.transfer(room.storage, creepStore0) : ERR_NOT_FOUND
                    if (result == OK) return
                    if (result == ERR_NOT_IN_RANGE) {
                        creep.moveTo(room.storage)
                        if (debug) console.log('从仓库取出底物1前 清空身上的资源')
                        return
                    }
                }

                result = room.storage != undefined ? creep.withdraw(room.storage, reactionConfig1) : ERR_NOT_FOUND
                if (result == OK) return
                if (room.storage && room.storage.store[reactionConfig1] > 0 && creep.store.getFreeCapacity() > 0 && result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(room.storage)
                    if (debug) console.log('从仓库取出底物1')
                    return
                }
                result = creep.transfer(lab1, reactionConfig1)
                if (result == OK) return
                if (room.storage && lab1FreeCapacity > 0 && creep.store[reactionConfig1] > 0 && result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(lab1)
                    if (debug) console.log('放入SourceLab1')
                    return
                }
            }

            if (lab2FreeCapacity > 1600 && lab2FreeCapacity >= lab1FreeCapacity && ((reactionConfig2 == lab2MineralType && lab2FreeCapacity > 0) || lab2MineralType == undefined)) {
                if (creep.store.getUsedCapacity() > 0 && creepStore0 != reactionConfig2 && room.storage != undefined) {
                    result = room.storage != undefined ? creep.transfer(room.storage, creepStore0) : ERR_NOT_FOUND
                    if (result == OK) return
                    if (result == ERR_NOT_IN_RANGE) {
                        creep.moveTo(room.storage)
                        if (debug) console.log('从仓库取出底物2前 清空身上的资源')
                        return
                    }
                }

                result = room.storage != undefined ? creep.withdraw(room.storage, reactionConfig2) : ERR_NOT_FOUND
                if (result == OK) return
                if (room.storage && room.storage.store[reactionConfig2] > 0 && creep.store.getFreeCapacity() > 0 && result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(room.storage)
                    if (debug) console.log('从仓库取出底物2')
                    return
                }
                result = creep.transfer(lab2, reactionConfig2)
                if (result == OK) return
                if (room.storage && lab2FreeCapacity > 0 && creep.store[reactionConfig2] > 0 && result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(lab2)
                    if (debug) console.log('放入SourceLab2')
                    return
                }
            }
        }

        const carryMineralType = Object.keys(creep.store)[0] as ResourceConstant
        result = room.storage != undefined ? creep.transfer(room.storage, carryMineralType) : ERR_NOT_FOUND
        if (result == OK) return
        if (creepData.waiting == 1 && room.storage && creep.store.getUsedCapacity() > 0 && result == ERR_NOT_IN_RANGE) {
            creep.moveTo(room.storage)
            if (debug) console.log('存放身上的资源')
            return
        }

        // 没有工作就就去SourceLab1和SourceLab2旁边待命
        if (creep.room.memory.structureIdList['sourceLab1'] && creep.room.memory.structureIdList['sourceLab2']) {
            const sourceLab1 = Game.getObjectById(creep.room.memory.structureIdList['sourceLab1']) as StructureLab
            const sourceLab2 = Game.getObjectById(creep.room.memory.structureIdList['sourceLab2']) as StructureLab
            if (!creep.pos.isNearTo(sourceLab1)) {
                creep.moveTo(sourceLab1)
                if (debug) console.log('待命 移动到SourceLab1')
                return
            }
            if (!creep.pos.isNearTo(sourceLab2)) {
                creep.moveTo(sourceLab2)
                if (debug) console.log('待命 移动到SourceLab2')
                return
            }
        } else {
            if (room.storage && !creep.pos.isNearTo(room.storage)) {
                creep.moveTo(room.storage)
                if (debug) console.log('待命 移动到仓库')
                return
            }
        }

        creepData.waiting--
        if (creepData.waiting <= 0) {
            creepData.waiting = 10
        }
    },
})
