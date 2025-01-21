import TeamDuo from "./TeamDuo"
import TeamQuad from "./TeamQuad"

const notImplemented = function (data: CreepData): ICreepConfig {
    throw new Error("Function not implemented.")
}

const teamWork: TeamWork = {
    duo: TeamDuo,
    quad: TeamQuad
}

export default teamWork
