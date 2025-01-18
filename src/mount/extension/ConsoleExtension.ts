export default class ConsoleExtension {
    public help(): string {
        return 'Hello World'
    }

    /**
     * 在两个点之间放置road工地
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @param roomName
     * @returns
     */
    public buildRoad(x1: number, y1: number, x2: number, y2: number, roomName: string): string {
        const source: RoomPosition = new RoomPosition(x1, y1, roomName)
        const target: RoomPosition = new RoomPosition(x2, y2, roomName)
        let pathFind = PathFinder.search(source, target, { swampCost: 1 });

        const room = Game.rooms[roomName]
        if (room != undefined) {
            pathFind.path.forEach(pos => {
                room.createConstructionSite(pos, STRUCTURE_ROAD)
            });
            return pathFind.path.toString()
        } else {
            return '房间不可见'
        }
    }

    /**
     * 移除所有的工地
     * @param roomName
     */
    public removeConstructionSites(roomName: string): string {
        const room = Game.rooms[roomName]
        if (room != undefined) {
            room.constructionSites.forEach(constructionSite => constructionSite.remove())
            return '已移除所有建筑工地'
        } else {
            return '房间不可见'
        }
    }

    /**
     * 显示核弹信息
     */
    public showNukers(): string {
        let html = '<html><style>tr,th,td{text-align:center} table{width:120%}</style>';
        html += '<body><table border="1"><thead><tr><th>RoomName</th><th>Cooldown</th><th>Ready</th><th>LeftTime</th></tr></thead><tbody>'
        Object.values(Game.rooms).forEach(room => {
            if (room.nuker != undefined) {
                const ready = room.nuker.cooldown == 0 ? '✅' : '❌';
                html += `<tr><td>${room.name}</td><td>${room.nuker.cooldown}</td><td>${ready}</td><td>${(room.nuker.cooldown * 2.5 / 60 / 60).toFixed(2)} h</td></tr>`;
            }
        });
        html += '</tbody></table></body></html>';
        return html;
    }
}
