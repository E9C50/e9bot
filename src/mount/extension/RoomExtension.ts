import { bodyConfigs, STRUCTURE_MEMORYKEY_PERFIX, STRUCTURE_PRIVATEKEY_PERFIX } from "settings";
import { getBodyConfig } from "utils";

export default class RoomExtension extends Room {

    private getStructure<T extends Structure>(structureType: string, privateKey: string, memoryKey: string): T | undefined {
        if (this[privateKey] != undefined) return (this[privateKey])

        if (this.memory[memoryKey] != undefined && Game.time % 10 != 0) {
            const structure: T = Game.getObjectById(this.memory[memoryKey]) as T;
            if (structure == undefined) {
                delete this.memory[memoryKey]
                delete this[privateKey]
                return undefined
            }
            this.memory[memoryKey] = structure.id
            this[privateKey] = structure;
            return structure
        } else {
            const filterd = this.structures.filter(structure => structure.structureType == structureType)
            if (filterd.length == 0) return undefined
            const structure: T = filterd[0] as T
            this.memory[memoryKey] = structure.id
            return structure
        }
    }

    private getStructures<T extends Structure>(structureType: string, privateKey: string, memoryKey: string): T[] {
        if (this[privateKey] != undefined) return (this[privateKey])

        if (this.memory[memoryKey] != undefined && Game.time % 10 != 0) {
            const structures: T[] = this.memory[memoryKey]
                .map(structureId => Game.getObjectById(structureId) as T)
                .filter(structure => structure != undefined)
            this.memory[memoryKey] = structures.map(structure => structure.id)
            this[privateKey] = structures;
            return structures
        } else {
            const structures: T[] = this.structures
                .filter(structure => structure.structureType == structureType)
                .map(structure => structure as T)
            this.memory[memoryKey] = structures.map(structure => structure.id)
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

    public creepConfigGetter(): { [creepName: string]: CreepMemory } {
        if (this.memory.creepConfig == undefined || Object.keys(this.memory.creepConfig).length == 0) {
            this.memory.creepConfig = {}
        }
        return this.memory.creepConfig
    }

    public creepConfigSetter(creepConfig: { [creepName: string]: CreepMemory }): void {
        this.memory.creepConfig = creepConfig
    }


    // 矿物资源缓存
    public sourcesGetter(): Source[] {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'SOURCES'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'SOURCES'

        if (this[privateKey]) return this[privateKey]

        if (this.memory[memoryKey] != undefined) {
            const sources: Source[] = this.memory[memoryKey].map(sourceId => Game.getObjectById(sourceId))
            this[privateKey] = sources;
            return sources
        } else {
            const sources: Source[] = this.find(FIND_SOURCES)
            this.memory[memoryKey] = sources.map(source => source.id)
            return sources
        }
    }
    public mineralGetter(): Mineral | undefined {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'MINERAL'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'MINERAL'
        if (this[privateKey]) return this[privateKey]

        if (this.memory[memoryKey] != undefined) {
            const mineral: Mineral = Game.getObjectById(this.memory[memoryKey]) as Mineral
            this[privateKey] = mineral;
            return mineral
        } else {
            const minerals: Mineral[] = this.find(FIND_MINERALS)
            if (minerals.length == 0) return undefined
            this.memory[memoryKey] = minerals[0].id
            return minerals[0]
        }
    }

    // 全局建筑缓存
    public structuresGetter(): Structure[] {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'STRUCTURE'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'STRUCTURE'
        if (this[privateKey]) return this[privateKey]

        if (this.memory[memoryKey] != undefined && Game.time % 10 != 0) {
            const structures: Structure[] = this.memory[memoryKey]
                .map(structureId => Game.getObjectById(structureId))
                .filter(structure => structure != undefined)
            this[privateKey] = structures;
            return structures
        } else {
            const structures: Structure[] = this.find(FIND_STRUCTURES)
            this.memory[memoryKey] = structures.map(source => source.id)
            return structures
        }
    }

    public constructionSitesGetter(): ConstructionSite[] {
        const privateKey = STRUCTURE_PRIVATEKEY_PERFIX + 'CONSTRUCTION_SITE'
        const memoryKey = STRUCTURE_MEMORYKEY_PERFIX + 'CONSTRUCTION_SITE'
        if (this[privateKey]) return this[privateKey]

        if (this.memory[memoryKey] != undefined && Game.time % 10 != 0) {
            const constructionSites: ConstructionSite[] = this.memory[memoryKey].map(structureId => Game.getObjectById(structureId))
            this[privateKey] = constructionSites;
            return constructionSites
        } else {
            const constructionSites: ConstructionSite[] = this.find(FIND_CONSTRUCTION_SITES)
            this.memory[memoryKey] = constructionSites.map(source => source.id)
            return constructionSites
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


    public spawnCreep(): void {
        const creepName = this.memory.creepSpawnQueue[0]
        const creepMemory = this.memory.creepConfig[creepName]

        const bodyConfig = bodyConfigs.worker;
        const bodyPart: BodyPartConstant[] = getBodyConfig(this, bodyConfig, false);

        this.spawns.forEach(spawn => {
            const spawnCode = spawn.spawnCreep(bodyPart, creepName, { memory: creepMemory })
            if (spawnCode == OK) {
                this.memory.creepSpawnQueue = this.memory.creepSpawnQueue.filter(name => name != creepName);
            }
        })
    }
}
