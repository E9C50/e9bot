import { assignPrototype } from "utils"
import CreepExtension from "./extension/CreepExtension"
import RoomExtension from "./extension/RoomExtension"

export function mountWork() {
    assignPrototype(Creep, CreepExtension)
    assignPrototype(Room, RoomExtension)
}
