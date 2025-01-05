import { getRoomResourceByType } from "utils";

/**
 * 移除已完成的订单
 */
function removeEmptyOrder(): void {
    Object.values(Game.market.orders).forEach(order => {
        if (order.remainingAmount == 0) Game.market.cancelOrder(order.id)
    })
}

/**
 * 维持指定数量的资源
 * @param keepAmount
 * @param maxPrice
 */
function keepResourceAmount(resourceType: ResourceConstant, keepAmount: number = 500000, maxPrice: number = 35, taskTick: number = 10): void {
    if (Game.time % taskTick != 0) return;
    if (Game.market.credits < 1000000) return;
    // 获取市场相关信息
    const myAllRoomName = Object.keys(Game.rooms).filter(roomName => Game.rooms[roomName].my);
    const allEnergyOrder = Game.market.getAllOrders({ type: ORDER_BUY, resourceType: resourceType });
    const maxBuyPrice = allEnergyOrder
        .filter(order => order.roomName !== undefined && !myAllRoomName.includes(order.roomName))
        .sort((a, b) => b.price - a.price)[0].price;
    const newPrice = Math.min(maxBuyPrice + 1, maxPrice);

    for (const roomName in Game.rooms) {
        const room: Room = Game.rooms[roomName];
        if (!room.my) continue;

        // 如果房间内的资源不足预设值，则从市场购买资源
        const totalEnergy = getRoomResourceByType(room, resourceType);
        if (totalEnergy < keepAmount) {
            // 如果已经有购买订单，则更新价格，否则创建新的购买订单
            const myBuyOrder = Object.values(Game.market.orders).filter(order => order.roomName == roomName && order.resourceType == resourceType && order.type == ORDER_BUY)[0]
            if (myBuyOrder != undefined && myBuyOrder.price != newPrice) {
                const result = Game.market.changeOrderPrice(myBuyOrder.id, newPrice)
                console.log(`[${roomName}] 更新资源购买订单价格，资源 ${resourceType}， 价格 ${newPrice}，返回值 ${result}`)
            } else if (myBuyOrder == undefined) {
                const result = Game.market.createOrder({ type: ORDER_BUY, resourceType: resourceType, price: newPrice, totalAmount: 100000, roomName: roomName })
                console.log(`[${roomName}] 创建资源购买订单，资源 ${resourceType}， 价格 ${newPrice}，返回值 ${result}`)
            }
        }
    }
}

export const resourceController = function (): void {
    removeEmptyOrder()

    keepResourceAmount(RESOURCE_ENERGY, 800000, 35, 100)
    keepResourceAmount(RESOURCE_OXYGEN, 10000, 35, 100)
    keepResourceAmount(RESOURCE_HYDROGEN, 10000, 35, 100)
    keepResourceAmount(RESOURCE_UTRIUM, 10000, 35, 100)
    keepResourceAmount(RESOURCE_ZYNTHIUM, 10000, 35, 100)
    keepResourceAmount(RESOURCE_KEANIUM, 10000, 35, 100)
    keepResourceAmount(RESOURCE_LEMERGIUM, 10000, 35, 100)
}
