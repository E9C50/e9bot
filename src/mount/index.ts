import { assignPrototype } from "utils"
import CreepExtension from "./extension/CreepExtension"
import RoomExtension from "./extension/RoomExtension"
import SourceExtension from "./extension/SourceExtension"

export function mountWork() {
    assignPrototype(Creep, CreepExtension)
    assignPrototype(Room, RoomExtension)

    assignPrototype(Source, SourceExtension)

}
