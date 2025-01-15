function getAvailableObserver(): StructureObserver | undefined {
    for (let roomName in Game.rooms) {
        const room = Game.rooms[roomName]
        if (room.observer != undefined) {
            return room.observer
        }
    }
    return undefined
}

function checkRoom(roomName) {
    if (Game.rooms[roomName] == undefined) return
    Game.rooms[roomName].find(FIND_HOSTILE_CREEPS).forEach(creep => {
        if (creep.owner.username == 'Reiuji_Utsuho' || creep.owner.username == 'Komeiji_Satori') return
        const groupedCount: { [key: string]: number } = {}
        for (const str of creep.body) {
            if (groupedCount[str.type] == undefined) {
                groupedCount[str.type] = 1
            } else {
                groupedCount[str.type] = groupedCount[str.type] + 1
            }
        }

        let bodyStr = '';
        Object.keys(groupedCount).forEach((key) => {
            bodyStr += `${key}*${groupedCount[key]} `;
        });

        console.log(`notify_检测到房间[${roomName}] 有Creep活动 所有者[${creep.owner.username}] 名称[${creep.name}] Body [${bodyStr}]]`)
    })
}


export const obScannerController = function (): void {
    // if (Game.time % 20 == 1) {
    //     const observer = getAvailableObserver()
    //     if (observer == undefined) return
    //     observer.observeRoom('E38N5')
    // }
    // if (Game.time % 20 == 2) {
    //     const observer = getAvailableObserver()
    //     if (observer == undefined) return
    //     observer.observeRoom('E36N7')
    // }
    // if (Game.time % 20 == 3) {
    //     const observer = getAvailableObserver()
    //     if (observer == undefined) return
    //     observer.observeRoom('E37N6')
    // }

    // if (Game.time % 20 == 2) {
    //     checkRoom('E38N5')
    // }
    // if (Game.time % 20 == 3) {
    //     checkRoom('E36N7')
    // }
    // if (Game.time % 20 == 4) {
    //     checkRoom('E37N6')
    // }
}
