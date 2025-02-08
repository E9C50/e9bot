export default {
    exec(creep: Creep): void {
        if (!prepare(creep)) return
    }
}

function prepare(creep: Creep): boolean {
    return true
}