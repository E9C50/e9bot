import { reactionSource } from "settings";

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
    public info(): string {
        const resourceTypes = [
            RESOURCE_ENERGY, RESOURCE_OPS, RESOURCE_POWER, RESOURCE_GHODIUM,
            RESOURCE_CATALYZED_GHODIUM_ACID, RESOURCE_CATALYZED_GHODIUM_ALKALIDE,
            RESOURCE_CATALYZED_LEMERGIUM_ACID, RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE,
            RESOURCE_CATALYZED_KEANIUM_ACID, RESOURCE_CATALYZED_KEANIUM_ALKALIDE,
            RESOURCE_CATALYZED_UTRIUM_ACID, RESOURCE_CATALYZED_UTRIUM_ALKALIDE,
            RESOURCE_CATALYZED_ZYNTHIUM_ACID, RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE,

            RESOURCE_CATALYST,
            RESOURCE_OXYGEN, RESOURCE_HYDROGEN, RESOURCE_UTRIUM,
            RESOURCE_LEMERGIUM, RESOURCE_KEANIUM, RESOURCE_ZYNTHIUM
        ];

        let html = '<html><style>tr,th,td{text-align:center} table{width:120%}</style>';
        html += '<body><table border="1"><thead><tr><th>房间名称</th><th>核弹就绪</th><th>核弹CD</th><th>核弹剩余时间</th><th>Lab配方</th><th>Lab工作状态</th>';

        resourceTypes.forEach(resourceType => {
            html += `<th>${resourceType}</th>`;
        });

        html += '</tr></thead><tbody>';

        Object.values(Game.rooms).forEach(room => {
            if (!room.my) return;

            const nukerCooldown = room.nuker?.cooldown || 0;
            const nukerLeftTime = ((room.nuker?.cooldown || 0) * 2.5 / 60 / 60).toFixed(2);
            let nukerReady = room.nuker?.cooldown == 0 ? '✅' : '❌';
            if (room.nuker != undefined && (room.nuker.store[RESOURCE_ENERGY] < 300000 || room.nuker.store[RESOURCE_GHODIUM] < 5000)) nukerReady = '🔁';

            let labWorking = false;
            const labConfig = room.memory.roomLabConfig;
            const labReaction = labConfig.labReactionConfig;
            if (labReaction != undefined && labConfig.sourceLab1 != undefined && labConfig.sourceLab2 != undefined) {
                const lab1 = Game.getObjectById<StructureLab>(labConfig.sourceLab1);
                const lab2 = Game.getObjectById<StructureLab>(labConfig.sourceLab2);
                if (lab1 != undefined && lab2 != undefined && lab1.store[reactionSource[labReaction][0]] > 0 && lab2.store[reactionSource[labReaction][1]] > 0) {
                    labWorking = true;
                }
            }

            html += `<tr><td>${room.name}</td><td>${nukerReady}</td><td>${nukerCooldown}</td><td>${nukerLeftTime} h</td>`;
            html += `<td>${labReaction || '-'}</td><td>${labWorking ? '✅' : '❌'}</td>`;

            // 添加资源数量的单元格，并根据数量设置颜色
            resourceTypes.forEach(resourceType => {
                let color = 'yellow'; // 默认黄色
                const resourceAmount = room.getResource(resourceType, true, true, true, true) || 0;
                if (room.name == Memory.centerStorage) {
                    if (resourceAmount < 10000) {
                        color = 'red';
                    } else if (resourceAmount >= 50000) {
                        color = 'green';
                    }
                } else if (resourceType == RESOURCE_OPS || resourceType == RESOURCE_POWER) {
                    if (resourceAmount < 1000) {
                        color = 'red';
                    } else if (resourceAmount >= 2000) {
                        color = 'green';
                    }
                } else {
                    if (resourceAmount < 5000) {
                        color = 'red'; // 小于3000显示红色
                    } else if (resourceAmount >= 10000) {
                        color = 'green'; // 大于5000显示绿色
                    }
                }
                html += `<td style="color: ${color};">${resourceAmount}</td>`;
            });

            html += '</tr>';
        });

        html += '</tbody></table></body></html>';
        return html;
    }

    /**
     * 重置合成配置
     */
    public resetReactionConfig(): boolean {
        Object.values(Game.rooms).forEach(room => {
            if (!room.my) return
            room.memory.roomLabConfig.labReactionConfig = undefined
            room.memory.roomFillJob.labInMineral = []
        })
        return true
    }

    /**
     * 清除终端发送任务
     */
    public clearSendJobs(): boolean {
        Object.values(Game.rooms).forEach(room => {
            if (!room.my) return
            room.memory.terminalSendJob = {}
        })
        return true
    }

    /**
     * 将资源全部发往中央仓库
     */
    public collectResource(resourceType: ResourceConstant): boolean {
        Object.values(Game.rooms).forEach(room => {
            if (!room.my) return
            const resourceAmount = room.getResource(resourceType, true, true)
            if (resourceAmount > 0) {
                room.sendResource(Memory.centerStorage, resourceType, resourceAmount)
            }
        })
        return true
    }

    /**
     * 清除寻路缓存
     */
    public clearCostMatrix(): boolean {
        Object.values(Game.rooms).forEach(room => {
            if (!room.my) return
            room.memory.defenderCostMatrix = ''
        })
        return true
    }
}
