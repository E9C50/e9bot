import { STRUCTURE_MEMORYKEY_PERFIX, STRUCTURE_PRIVATEKEY_PERFIX } from "settings";

export default class RoomExtension extends Room {

    private getStructure<T extends Structure>(structureType: string, privateKey: string, memoryKey: string): T | undefined {
        if (this[privateKey] != undefined) return (this[privateKey])

        const structure: T = Game.getObjectById(this.memory.structureIdList[memoryKey]) as T;
        if (structure != undefined) {
            if (structure == undefined) {
                delete this.memory.structureIdList[memoryKey]
                delete this[privateKey]
                return undefined
            }
            this.memory.structureIdList[memoryKey] = structure.id
            this[privateKey] = structure;
            return structure
        } else {
            const filterd = this.structures.filter(structure => structure.structureType == structureType)
            if (filterd.length == 0) return undefined
            const structure: T = filterd[0] as T
            this.memory.structureIdList[memoryKey] = structure.id
            return structure
        }
    }

    private getStructures<T extends Structure>(structureType: string, privateKey: string, memoryKey: string): T[] {
        if (this[privateKey] != undefined) return (this[privateKey])

        const structures: T[] = this.memory.structureIdList[memoryKey] == undefined ? [] :
            this.memory.structureIdList[memoryKey]
                .map(structureId => Game.getObjectById(structureId) as T)
                .filter(structure => structure != undefined)
        if (structures.length > 0) {
            this.memory.structureIdList[memoryKey] = structures.map(structure => structure.id)
            this[privateKey] = structures;
            return structures
        } else {
            const structures: T[] = this.structures
                .filter(structure => structure.structureType == structureType)
                .map(structure => structure as T)
            this.memory.structureIdList[memoryKey] = structures.map(structure => structure.id)
            return structures
        }
    }

    // Room基础属性
    public myGetter(): boolean {
        return this.controller != null && this.controller.my
    }

    public levelGetter(): number {
        return this.controller?.level || this.invaderCore?.level || 0
    }

    // 矿物资源缓存
    public sourcesGetter(): Source[] {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'SOURCES'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'SOURCES'
        if (this[privateKey]) return this[privateKey]

        const sources: Source[] = this.memory.structureIdList[memoryKey] == undefined ? [] :
            this.memory.structureIdList[memoryKey]
                .map(sourceId => Game.getObjectById(sourceId))
                .filter(source => source != undefined)
        if (sources.length > 0) {
            this[privateKey] = sources;
            return sources
        } else {
            const sources: Source[] = this.find(FIND_SOURCES)
            this.memory.structureIdList[memoryKey] = sources.map(source => source.id)
            return sources
        }
    }
    public mineralGetter(): Mineral | undefined {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'MINERAL'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'MINERAL'
        if (this[privateKey]) return this[privateKey]

        const mineral: Mineral = Game.getObjectById(this.memory.structureIdList[memoryKey]) as Mineral
        if (mineral != undefined) {
            this[privateKey] = mineral;
            return mineral
        } else {
            const minerals: Mineral[] = this.find(FIND_MINERALS)
            if (minerals.length == 0) return undefined
            this.memory.structureIdList[memoryKey] = minerals[0].id
            return minerals[0]
        }
    }

    // 敌人缓存
    public enemiesGetter(): Creep[] {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'ENEMIES'
        if (this[privateKey]) {
            return this[privateKey]
        }
        const enemies: Creep[] = this.find(FIND_HOSTILE_CREEPS)
        this[privateKey] = enemies
        return enemies
    }

    // 废墟、墓碑和掉落资源缓存
    public ruinsGetter(): Ruin[] {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'RUINS'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'RUINS'
        if (this[privateKey]) return this[privateKey]

        const ruins: Ruin[] = this.find(FIND_RUINS)
        this[privateKey] = ruins
        return ruins
    }

    public tombstonesGetter(): Tombstone[] {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'TOMBSTONES'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'TOMBSTONES'
        if (this[privateKey]) return this[privateKey]

        const tombstones: Tombstone[] = this.find(FIND_TOMBSTONES)
        this[privateKey] = tombstones
        return tombstones
    }

    public droppedResourceGetter(): Resource[] {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'DROPPED_RESOURCE'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'DROPPED_RESOURCE'
        if (this[privateKey]) return this[privateKey]

        const droppedResources: Resource[] = this.find(FIND_DROPPED_RESOURCES)
        this[privateKey] = droppedResources
        return droppedResources
    }

    // 需要修复的墙缓存
    public wallsNeedRepairGetter(): Structure[] {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'WALLS_NEED_REPAIR'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'WALLS_NEED_REPAIR'
        if (this[privateKey]) return this[privateKey]

        const walls: Structure[] = this.structures.filter(structure => structure.hits < structure.hitsMax &&
            (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART)
        )
        this[privateKey] = walls
        return walls
    }

    // 需要维修的建筑缓存
    public structuresNeedRepairGetter(): Structure[] {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'STRUCTURES_NEED_REPAIR'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'STRUCTURES_NEED_REPAIR'
        if (this[privateKey]) return this[privateKey]

        const structures: Structure[] = this.structures.filter(structure => structure.hits < structure.hitsMax &&
            structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART
        )
        this[privateKey] = structures
        return structures
    }

    // 全局建筑缓存
    public structuresGetter(): Structure[] {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'STRUCTURE'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'STRUCTURE'
        if (this[privateKey]) return this[privateKey]

        const structures: Structure[] = this.memory.structureIdList[memoryKey] == undefined ? [] :
            this.memory.structureIdList[memoryKey].map(structureId => Game.getObjectById(structureId))
                .filter(structure => structure != undefined)
        if (structures.length > 0) {
            this[privateKey] = structures;
            return structures
        } else {
            const structures: Structure[] = this.find(FIND_STRUCTURES)
            this.memory.structureIdList[memoryKey] = structures.map(source => source.id)
            return structures
        }
    }

    public constructionSitesGetter(): ConstructionSite[] {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'CONSTRUCTION_SITE'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'CONSTRUCTION_SITE'
        if (this[privateKey]) return this[privateKey]

        const constructionSites: ConstructionSite[] = this.memory.structureIdList[memoryKey] == undefined ? [] :
            this.memory.structureIdList[memoryKey].map(structureId => Game.getObjectById(structureId))
                .filter(structure => structure != undefined)
        if (constructionSites.length > 0) {
            this[privateKey] = constructionSites;
            return constructionSites
        } else {
            const constructionSites: ConstructionSite[] = this.find(FIND_CONSTRUCTION_SITES)
            this.memory.structureIdList[memoryKey] = constructionSites.map(source => source.id)
            return constructionSites
        }
    }

    public centerLinkGetter(): StructureLink | undefined {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'STRUCTURE_CENTER_LINK'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'STRUCTURE_CENTER_LINK'
        if (this[privateKey]) return this[privateKey]

        const link: StructureLink = Game.getObjectById(this.memory.structureIdList[memoryKey]) as StructureLink
        if (link != undefined) {
            this[privateKey] = link;
            return link
        } else {
            const link = this.links.filter(link => this.storage && link.pos.inRangeTo(this.storage.pos, 2))[0]
            this.memory.structureIdList[memoryKey] = link?.id
            this[privateKey] = link;
            return link
        }
    }

    public controllerLinkGetter(): StructureLink | undefined {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'STRUCTURE_CONTROLLER_LINK'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'STRUCTURE_CONTROLLER_LINK'
        if (this[privateKey]) return this[privateKey]

        const link: StructureLink = Game.getObjectById(this.memory.structureIdList[memoryKey]) as StructureLink
        if (link != undefined) {
            this[privateKey] = link;
            return link
        } else {
            const link = this.links.filter(link => this.controller && link.pos.inRangeTo(this.controller.pos, 2))[0]
            this.memory.structureIdList[memoryKey] = link?.id
            this[privateKey] = link;
            return link
        }
    }

    // 单个建筑缓存
    public nukerGetter(): StructureNuker | undefined {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'STRUCTURE_NUKER'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'STRUCTURE_NUKER'
        return this.getStructure<StructureNuker>(STRUCTURE_NUKER, privateKey, memoryKey)
    }
    public extractorGetter(): StructureExtractor | undefined {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'STRUCTURE_EXTRACTOR'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'STRUCTURE_EXTRACTOR'
        return this.getStructure<StructureExtractor>(STRUCTURE_EXTRACTOR, privateKey, memoryKey)
    }
    public factoryGetter(): StructureFactory | undefined {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'STRUCTURE_FACTORY'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'STRUCTURE_FACTORY'
        return this.getStructure<StructureFactory>(STRUCTURE_FACTORY, privateKey, memoryKey)
    }
    public observerGetter(): StructureObserver | undefined {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'STRUCTURE_OBSERVER'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'STRUCTURE_OBSERVER'
        return this.getStructure<StructureObserver>(STRUCTURE_OBSERVER, privateKey, memoryKey)
    }
    public powerSpawnGetter(): StructurePowerSpawn | undefined {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'STRUCTURE_POWER_SPAWN'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'STRUCTURE_POWER_SPAWN'
        return this.getStructure<StructurePowerSpawn>(STRUCTURE_POWER_SPAWN, privateKey, memoryKey)
    }
    public invaderCoreGetter(): StructureInvaderCore | undefined {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'STRUCTURE_INVADER_CORE'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'STRUCTURE_INVADER_CORE'
        return this.getStructure<StructureInvaderCore>(STRUCTURE_INVADER_CORE, privateKey, memoryKey)
    }

    // 多个建筑缓存
    public spawnsGetter(): StructureSpawn[] {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'STRUCTURE_SPAWN'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'STRUCTURE_SPAWN'
        return this.getStructures<StructureSpawn>(STRUCTURE_SPAWN, privateKey, memoryKey)
    }
    public extensionsGetter(): StructureExtension[] {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'STRUCTURE_EXTENSION'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'STRUCTURE_EXTENSION'
        return this.getStructures<StructureExtension>(STRUCTURE_EXTENSION, privateKey, memoryKey)
    }
    public towersGetter(): StructureTower[] {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'STRUCTURE_TOWER'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'STRUCTURE_TOWER'
        return this.getStructures<StructureTower>(STRUCTURE_TOWER, privateKey, memoryKey)
    }
    public containersGetter(): StructureContainer[] {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'STRUCTURE_CONTAINER'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'STRUCTURE_CONTAINER'
        return this.getStructures<StructureContainer>(STRUCTURE_CONTAINER, privateKey, memoryKey)
    }
    public linksGetter(): StructureLink[] {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'STRUCTURE_LINK'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'STRUCTURE_LINK'
        return this.getStructures<StructureLink>(STRUCTURE_LINK, privateKey, memoryKey)
    }
    public labsGetter(): StructureLab[] {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'STRUCTURE_LAB'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'STRUCTURE_LAB'
        return this.getStructures<StructureLab>(STRUCTURE_LAB, privateKey, memoryKey)
    }
    public roadsGetter(): StructureRoad[] {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'STRUCTURE_ROAD'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'STRUCTURE_ROAD'
        return this.getStructures<StructureRoad>(STRUCTURE_ROAD, privateKey, memoryKey)
    }
    public wallsGetter(): StructureWall[] {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'STRUCTURE_WALL'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'STRUCTURE_WALL'
        return this.getStructures<StructureWall>(STRUCTURE_WALL, privateKey, memoryKey)
    }
    public rampartsGetter(): StructureRampart[] {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'STRUCTURE_RAMPART'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'STRUCTURE_RAMPART'
        return this.getStructures<StructureRampart>(STRUCTURE_RAMPART, privateKey, memoryKey)
    }
    public keeperLairsGetter(): StructureKeeperLair[] {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'STRUCTURE_KEEPER_LAIR'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'STRUCTURE_KEEPER_LAIR'
        return this.getStructures<StructureKeeperLair>(STRUCTURE_KEEPER_LAIR, privateKey, memoryKey)
    }
    public portalsGetter(): StructurePortal[] {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'STRUCTURE_PORTAL'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'STRUCTURE_PORTAL'
        return this.getStructures<StructurePortal>(STRUCTURE_PORTAL, privateKey, memoryKey)
    }
    public powerBanksGetter(): StructurePowerBank[] {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'STRUCTURE_POWER_BANK'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'STRUCTURE_POWER_BANK'
        return this.getStructures<StructurePowerBank>(STRUCTURE_POWER_BANK, privateKey, memoryKey)
    }
}
