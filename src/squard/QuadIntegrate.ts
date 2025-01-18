export default (data: TeamConfig): ITeamConfig => ({
    prepare: function (creep: Creep): boolean {
        throw new Error("Function not implemented.");
    },
    doWork: function (creep: Creep): boolean {
        throw new Error("Function not implemented.");
    }
})
