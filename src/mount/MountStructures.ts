const multipleList = new Set([
    STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER, STRUCTURE_CONTAINER,
    STRUCTURE_LINK, STRUCTURE_LAB, STRUCTURE_ROAD, STRUCTURE_WALL, STRUCTURE_RAMPART,
    STRUCTURE_KEEPER_LAIR, STRUCTURE_PORTAL, STRUCTURE_POWER_BANK,
])

const singleList = new Set([
    STRUCTURE_OBSERVER, STRUCTURE_EXTRACTOR, STRUCTURE_NUKER, STRUCTURE_FACTORY,
    STRUCTURE_POWER_SPAWN, STRUCTURE_INVADER_CORE,
    //STRUCTURE_TERMINAL,   STRUCTURE_CONTROLLER,   STRUCTURE_STORAGE,
])

export function mountStructures() {
    Object.defineProperty(Room.prototype, 'sources', {
        get: function () {
            if (!this._sources) {
                if (!this.memory._sources) {
                    this.memory._sources = this.find(FIND_SOURCES).map((source: Source) => source.id)
                }
                this._sources = this.memory._sources.map((id: string) => Game.getObjectById(id))
            }
            return this._sources
        },
        enumerable: false,
        configurable: true
    })

    Object.defineProperty(Room.prototype, 'mineral', {
        get: function () {
            if (!this._mineral) {
                if (!this.memory._mineral) {
                    this.memory._mineral = this.find(FIND_MINERALS)[0].id
                }
                this._mineral = Game.getObjectById(this.memory._mineral)
            }
            return this._mineral
        },
        enumerable: false,
        configurable: true
    })

    Object.defineProperty(Room.prototype, 'constructionSites', {
        get: function () {
            if (!this._constructionSites) {
                if (!this.memory._constructionSites || this.memory._constructionSites.length == 0) {
                    this.memory._constructionSites = this.find(FIND_CONSTRUCTION_SITES).map((constructionSite: ConstructionSite) => constructionSite.id)
                }
                this._constructionSites = this.memory._constructionSites.map((id: string) => Game.getObjectById(id)).filter((item: ConstructionSite) => item)
            }
            return this._constructionSites
        },
        enumerable: false,
        configurable: true
    })

    Object.defineProperty(Room.prototype, 'structures', {
        get: function () {
            if (!this._structures) {
                if (!this.memory._structures || this.memory._structures.length == 0 || Game.time % 10 == 0) {
                    this.memory._structures = this.find(FIND_STRUCTURES).map((structure: Structure) => structure.id)
                }
                this._structures = this.memory._structures.map((id: string) => Game.getObjectById(id)).filter((item: Structure) => item)
            }
            return this._structures
        },
        enumerable: false,
        configurable: true
    })

    singleList.forEach(type => {
        const bindstring = '_' + type
        Object.defineProperty(Room.prototype, type, {
            get: function () {
                if (bindstring in this) {
                    return this.bindstring
                }

                if (bindstring in this.memory) {
                    const structureCache = Game.getObjectById(this.memory.bindstring)
                    if (structureCache) return structureCache
                    this.memory.bindstring = undefined
                }

                const structureCache = this.structures.filler((structure: Structure) => structure.structureType == type)[0]
                if (!structureCache) return undefined

                this.memory.bindstring = structureCache.id
                return structureCache
            },
            enumerable: false,
            configurable: true
        })
    })


    multipleList.forEach(type => {
        const bindstring = '_' + type + 's'
        Object.defineProperty(Room.prototype, type + 's', {
            get: function () {
                if (bindstring in this) {
                    return this.bindstring
                }

                if (bindstring in this.memory) {
                    const structureCaches: Structure[] = this.memory[bindstring].map((id: string) => Game.getObjectById(id))
                    if (structureCaches && structureCaches.length > 0) return structureCaches
                    this.memory[bindstring] = undefined
                }

                const structureCache = this.structures.filter((structure: Structure) => structure.structureType == type)
                if (!structureCache) return undefined

                this.memory[bindstring] = structureCache.map((structure: Structure) => structure.id)
                return structureCache
            },
            enumerable: false,
            configurable: true
        })
    })
}
