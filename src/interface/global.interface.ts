declare namespace NodeJS {
    interface Global {
        SpawnQueue: { [room: string]: CreepSpawnData[] }
    }
}