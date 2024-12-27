import jsSHA from "jssha";

/**
 * 把 obj2 的原型合并到 obj1 的原型上
 * 如果原型的键以 Getter 结尾，则将会把其挂载为 getter 属性
 * @param obj1 要挂载到的对象
 * @param obj2 要进行挂载的对象
 */
export const assignPrototype = function (obj1: { [key: string]: any }, obj2: { [key: string]: any }) {
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
 * 对输入的字符串进行拼接并且进行SHA1
 * @param strings 输入的n个字符串
 * @returns
 */
export const sha1String = function (...strings: string[]): string {
    const concatenatedString = strings.join('_')
    const shaObj = new jsSHA("SHA-1", "TEXT", { encoding: "UTF8" })
    shaObj.update(concatenatedString)
    return shaObj.getHash("HEX").toUpperCase().substring(0, 16)
}



/**
 * 给指定文本添加颜色
 *
 * @param content 要添加颜色的文本
 * @param colorName 要添加的颜色常量字符串
 * @param bolder 是否加粗
 */
export function colorful(content: string, colorName: colorEnum, bolder: boolean = false): string {
    const colorStyle = colorName ? `color: ${colorName.valueOf};` : ''
    const bolderStyle = bolder ? 'font-weight: bolder;' : ''

    return `<text style="${[colorStyle, bolderStyle].join(' ')}">${content}</text>`
}

/**
 * 全局日志
 *
 * @param content 日志内容
 * @param prefixes 前缀中包含的内容
 * @param color 日志前缀颜色
 * @param notify 是否发送邮件
 */
export function log(content: string, prefixes: string[] = [], color: colorEnum = colorEnum.GREEN, notify: boolean = false): OK {
    // 有前缀就组装在一起
    let prefix = prefixes.length > 0 ? `【${prefixes.join(' ')}】 ` : ''
    // 指定了颜色
    prefix = colorful(prefix, color, true)

    const logContent = `${prefix}${content}`
    console.log(logContent)
    // 转发到邮箱
    if (notify) Game.notify(logContent)

    return OK
}
