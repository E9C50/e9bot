interface Creep {
    init(): void;
    exec(): void;
}

interface CreepMemory {
    role: string;
}