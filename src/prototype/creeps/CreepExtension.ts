import roles from 'roles'

export default class CreepExtension extends Creep {
    public init(): void {
    }

    public exec(): void {
        if (this.spawning) return

        // 小队成员就跳过

        // 战争模式且不是战争爬就跳过

        // 角色不存在就跳过
        if (this.memory.role == undefined) {
            this.say('我是谁？我在哪？')
            return
        }

        roles[this.memory.role].exec()
    }
}