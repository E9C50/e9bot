declare module NodeJS {
    // 全局对象
    interface Global {
        BetterMove: {
            deletePathInRoom: (roomName: string) => boolean
        }
    }
}

interface Memory {
    centerStorage: string
    warMode: { [room: string]: boolean }
}

interface Structure {
    init(): void
    doWork(): void
}
