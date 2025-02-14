interface Room {
    //------------------------- 建筑房间缓存 -------------------------//
    level: number;  /** 房间等级 */
    my: boolean;    /** 房间是否为自己所有 */

    mineral: Mineral;                   /** 房间中的mineral对象 */
    source: Source[];                   /** 房间中的source数组 */
    deposit: Deposit[];                 /** 房间中的deposit数组 */
    powerBank: StructurePowerBank[];    /** 房间中的powerBank数组 */

    rampart: StructureRampart[];        /** 房间中的rampart数组 */
    constructedWall: StructureWall[];   /** 房间中的wall数组 */

    constructionSite: ConstructionSite[]/** 房间中的ConstructionSite数组 */

    extension: StructureExtension[];    /** 房间中的extension数组 */
    container: StructureContainer[];    /** 房间中的container数组 */
    spawn: StructureSpawn[];            /** 房间中的spawn数组 */
    tower: StructureTower[];            /** 房间中的tower数组 */
    link: StructureLink[];              /** 房间中的link数组 */
    lab: StructureLab[];                /** 房间中的lab数组 */

    powerSpawn: StructurePowerSpawn;    /** 房间中的powerSpawn对象 */
    extractor: StructureExtractor;      /** 房间中的extractor对象 */
    observer: StructureObserver;        /** 房间中的observer对象 */
    factory: StructureFactory;          /** 房间中的factory对象 */
    nuker: StructureNuker;              /** 房间中的nuker对象 */

    /** 得到包括此房间所有（按此顺序：）storage、terminal、factory、container的数组 */
    mass_stores: (StructureStorage | StructureTerminal | StructureFactory | StructureContainer)[];

    //------------------------- 建筑房间缓存 -------------------------//

    creepCounts: { [roleName in CreepRoleConstant]: number }

    init(): void;
    exec(): void;

    update(type?: StructureConstant): void;     // 房间建筑缓存更新
}

interface RoomMemory {
    harvestConfig: { [sourceId: string]: string[] }
}