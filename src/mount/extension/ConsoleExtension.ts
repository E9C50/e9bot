import { reactionConfig, reactionSource } from "settings";

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
            room.constructionSites.forEach(constructionSite => {
                if (constructionSite.progress == 0) {
                    constructionSite.remove()
                }
            })
            return '已移除所有建筑工地'
        } else {
            return '房间不可见'
        }
    }

    /**
     * 显示房间信息
     */
    public showRoomInfo(): string {
        let html = '<html><style>tr,th,td{text-align:center} table{width:120%}</style>';
        html += '<body><table border="1"><thead><tr><th>房间名称</th><th>核弹就绪</th><th>核弹CD</th><th>核弹剩余时间</th><th>Lab配方</th><th>Lab工作状态</th></tr></thead><tbody>'
        Object.values(Game.rooms).forEach(room => {
            html += '<tr>'
            if (room.nuker != undefined) {
                const nukerCooldown = room.nuker.cooldown
                const nukerLeftTime = (room.nuker.cooldown * 2.5 / 60 / 60).toFixed(2)
                const nukerReady = room.nuker.cooldown == 0 ? '✅' : '❌';
                html += `<td>${room.name}</td><td>${nukerReady}</td><td>${nukerCooldown}</td><td>${nukerLeftTime} h</td>`;
            }

            if (room.labs.length > 0) {
                let labWorking = false
                const labConfig = room.memory.roomLabConfig
                const labReaction = labConfig.labReactionQueue[0]
                if (labReaction != undefined && labConfig.sourceLab1 != undefined && labConfig.sourceLab2 != undefined) {
                    const lab1 = Game.getObjectById<StructureLab>(labConfig.sourceLab1)
                    const lab2 = Game.getObjectById<StructureLab>(labConfig.sourceLab2)
                    if (lab1 != undefined && lab2 != undefined && lab1.store[reactionSource[labReaction][0]] > 0 && lab2.store[reactionSource[labReaction][1]] > 0) {
                        labWorking = true
                    }
                }
                html += `<td>${labReaction || '-'}</td><td>${labWorking ? '✅' : '❌'}</td>`;
            }

            html += '</tr>'
        });
        html += '</tbody></table></body></html>';
        return html;
    }

    /**
     * 集中资源
     */
    public sendCenterResource(): boolean {
        const centerRoom = 'E35N3'

        Object.values(Game.rooms).forEach(room => {
            if (!room.my) return
            if (room.name == centerRoom) return

            const resAmount = room.memory.resourceAmount
            Object.keys(resAmount).forEach(resType => {
                if (resType != RESOURCE_ENERGY) {
                    room.sendResource(centerRoom, resType as ResourceConstant, resAmount[resType])
                }
            });
        });
        return true
    }

    /**
     * 清除终端发送任务
     */
    public clearSendJobs(): boolean {
        Object.values(Game.rooms).forEach(room => {
            room.memory.terminalSendJob = {}
        })
        return true
    }

    /**
     * 清除寻路缓存
     */
    public clearCostMatrix(): boolean {
        Object.values(Game.rooms).forEach(room => {
            room.memory.defenderCostMatrix = []
        })
        return true
    }
}
