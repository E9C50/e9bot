import { assignPrototype } from "utils"
import { mountStructures } from "./MountStructures"
import CreepExtension from "./extension/CreepExtension"

export function mountWork() {
    mountStructures()

    assignPrototype(Creep, CreepExtension)
}
