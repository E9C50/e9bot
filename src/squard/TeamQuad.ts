export default (data: TeamConfig): ITeamConfig => ({
    prepare: function (): boolean {
        return true
    },
    doWork: function (): boolean {
        return true
    }
})
