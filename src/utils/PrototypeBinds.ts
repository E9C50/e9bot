
/**
 * 挂载到全局
 * @param obj
 */
export function assignGlobal(obj: { [key: string]: any }) {
    Object.getOwnPropertyNames(obj.prototype).forEach(key => {
        global[key] = obj.prototype[key]
    })
}

/**
 * 把 obj2 的原型合并到 obj1 的原型上
 * 如果原型的键以 Getter 结尾，则将会把其挂载为 getter 属性
 * @param obj1 要挂载到的对象
 * @param obj2 要进行挂载的对象
 */
export function assignPrototype(obj1: { [key: string]: any }, obj2: { [key: string]: any }) {
    Object.getOwnPropertyNames(obj2.prototype).forEach(key => {
        if (key.includes('Getter')) {
            Object.defineProperty(obj1.prototype, key.split('Getter')[0], {
                get: obj2.prototype[key],
                enumerable: false,
                configurable: true
            })
        } else if (key.includes('Setter')) {
            Object.defineProperty(obj1.prototype, key.split('Setter')[0], {
                set: obj2.prototype[key],
                enumerable: false,
                configurable: true
            })
        } else obj1.prototype[key] = obj2.prototype[key]
    })
}

/**
 * 属性装饰器：将 Room 对象的属性绑定到 global[room.name]
 * @param target Room 原型
 * @param propertyKey 属性名（如 energyReserve）
 */
export function BindRoomGlobalProperty(target: Room, propertyKey: string) {
    const key = propertyKey as keyof Room;
    const getter = function (this: Room) {
        if (!this.name) return undefined;
        if (!global[this.name]) global[this.name] = {};
        return global[this.name][key];
    };

    const setter = function (this: Room, value: any) {
        if (!this.name) return;
        if (!global[this.name]) global[this.name] = {};
        global[this.name][key] = value;
    };

    Object.defineProperty(Room.prototype, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true,
    });
}

/**
 * 属性装饰器：将 Room 对象的属性绑定到 room.memory
 * @param target Room 原型
 * @param propertyKey 属性名（如 energyReserve）
 */
export function BindRoomMemoryProperty(target: Room, propertyKey: string) {
    const key = propertyKey as keyof Room;

    const getter = function (this: Room) {
        if (this == undefined || this.name == undefined) return
        if (!this.memory) this.memory = {} as RoomMemory;
        return this.memory[key];
    };

    const setter = function (this: Room, value: any) {
        if (this == undefined || this.name == undefined) return
        if (!this.memory) this.memory = {} as RoomMemory;
        this.memory[key] = value;
    };

    Object.defineProperty(Room.prototype, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true,
    });
}