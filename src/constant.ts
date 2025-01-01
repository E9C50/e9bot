import CreepFiller from "role/RoleFiller";
import CreepHarvester from "role/RoleHarvester";

export enum roleBaseEnum {
    HARVESTER = 'harvester',
    FILLER = 'filler',
    UPGRADER = 'upgrader',
    BUILDER = 'builder',
    REPAIRER = 'repairer',
    MINER = 'miner',
}

export enum roleAdvEnum {
    MANAGER = "manager",
    CLAIMER = "claimer",
    RESERVER = "reserver",
    RHARVESTER = "remoteHarvester",
    RFILLER = "remoteFiller",
}

export enum roleWarEnum {
    SOLDIER = "soldier",
    DOCTOR = "doctor",
    DISMANTLER = "dismantler",
    DEFENDER = "defender",
    ALLINONE = "allinone",
}

type CreepClassMapType = {
    [values in CreepRoleConstant]: typeof CreepHarvester | typeof CreepFiller;
};
export const creepClassMap: CreepClassMapType = {
    [roleBaseEnum.HARVESTER]: CreepHarvester,
    [roleBaseEnum.FILLER]: CreepFiller,
    [roleBaseEnum.UPGRADER]: CreepHarvester,
    [roleBaseEnum.BUILDER]: CreepHarvester,
    [roleBaseEnum.REPAIRER]: CreepHarvester,
    [roleBaseEnum.MINER]: CreepHarvester,
    [roleAdvEnum.MANAGER]: CreepHarvester,
    [roleAdvEnum.CLAIMER]: CreepHarvester,
    [roleAdvEnum.RESERVER]: CreepHarvester,
    [roleAdvEnum.RHARVESTER]: CreepHarvester,
    [roleAdvEnum.RFILLER]: CreepFiller,
    [roleWarEnum.SOLDIER]: CreepHarvester,
    [roleWarEnum.DOCTOR]: CreepHarvester,
    [roleWarEnum.DISMANTLER]: CreepHarvester,
    [roleWarEnum.DEFENDER]: CreepHarvester,
    [roleWarEnum.ALLINONE]: CreepHarvester
};
