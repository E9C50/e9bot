import { boostTypeEnum } from "settings"

export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        const creepData: HealerData = data as HealerData
        return Game.flags[creepData.targetFlag] != undefined
    },
    prepare(creep) {
        if (!creep.memory.ready && creep.memory.needBoost) {
            return creep.goBoost([boostTypeEnum.BoostTypeHeal, boostTypeEnum.BoostTypeMove])
        }
        return true
    },
    source(creep) {
        creep.memory.working = true
        return true
    },
    target(creep) {
        const creepData: HealerData = data as HealerData
        const targetFlag: Flag = Game.flags[creepData.targetFlag]

        var target: Flag | Creep = targetFlag;
        if (creepData.targetCreep != undefined) {
            const targetCreep = Game.getObjectById(creepData.targetCreep)
            if (targetCreep == undefined) {
                creepData.targetCreep = undefined
            } else {
                target = targetCreep as Creep
                if (target.hits < target.hitsMax) {
                    creep.heal(target)
                }
            }
        }

        if (targetFlag == undefined && creepData.targetCreep == undefined) {
            creep.say('❓')
            return false
        }

        if (creepData.targetCreep == undefined || targetFlag != undefined) {
            const flagCreep = targetFlag.pos.lookFor(LOOK_CREEPS)[0]
            if (flagCreep != undefined) {
                creepData.targetCreep = flagCreep.id
            }
        }

        if (target != undefined && !creep.pos.isEqualTo(target.pos)) {
            creep.moveTo(target)
        }

        return true
    },
})
