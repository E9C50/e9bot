export default (data: CreepData): ICreepConfig => ({
    isNeed: (room: Room, creepName: string) => {
        return true
    },
    prepare(creep) {
        return true
    },
    source(creep) {
        return true
    },
    target(creep) {
        return true
    },
})
