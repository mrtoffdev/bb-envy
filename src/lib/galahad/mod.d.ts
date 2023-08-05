// Primitives
import {NS} from "@ns";

export type n_arr4      = [number, number, number, number];
export type lock_n_arr4 = readonly [number, number, number, number];

//#region Galahad type-guards & defs
export {Axiom_L, Axiom, Stratagem, isStrategy};

const Axiom_L = [
    'spoof',
    'exploit',
    'deposit'
] as const;

type Stratagem      = Axiom[];
type Axiom = (typeof Axiom_L)[number];

const isStrategy    = (In: any): In is Axiom => {
    return Strategy_L.indexOf(In) !== -1;
}
//#endregion

//#region XAVT

export {XAVT, GTarget, AttackScheduleBlueprint,SchedUnit, SRAT}

/**
 *  Cross AVT Config
 *  XAVT is a master object that contains all the configuration data required by the Andromeda Module
 *
 *  Specification:
 *  - Target: {host, target}: string
 *  - ASB   :
 *      Stratagem = contains the sequence of Axioms to perform in one deploy interval
 *      - Stratagem : (Common) n_arr4[Axiom]
 *                  : (Optional) n_arrX[Axiom]
 *
 * */

// [main] --- target ---> [Galahad] --- XAVT ---> [Andromeda] --- CFG ---> [AVT Channel] ++> Axioms(inf)

interface XAVT {
    target  : GTarget,
    ASB     ?: {[target: string]:AttackScheduleBlueprint},
    SRAT    ?: SRAT,
}

interface GTarget {
    target      : string,
    provider    : string,
}

/**
 *  Attack Schedule Blueprint
 *  ASB
 * */
interface AttackScheduleBlueprint {
    stratagem   : Stratagem,

    t_cycle_all : n_arr4,
    t_cycle_max : number,

    threads     : n_arr4,
    offset      : number,
}

interface SchedUnit {
    cycle_duration  : number,
    target_clusts   : number,
    offsets         : n_arr4,
    intervals       : number,
}

interface Metadata {

}

/**
 *  Schedules, Resource Allocation, Thresholds
 *  SRAT
 * */
interface SRAT {
    [server: string]: SchedUnit
}

/**
 *  GTarget generation:
 *  target: target host
 *  provider: provider of resource requests (home)
 *  max_time: !PROPOSE AS OPTIONAL
 *  offset: vector offsets
 *  durations:  - container of vector's next scheduled deployment ONLY.
 *              - accuracy: med
 *              - size: same as stratagem.
 *  stratagem: container of axiom steps per cluster deployment
 *  threads: container of threads per axiom
 *              - size: same as stratagem/
 * */
//#endregion

export interface GalahadState {
    clusternet  : XAVT[],
}

//#region Andromeda
export interface SchedulerState {
    // configuration
    ns          : NS,
    active      : boolean,
    speed       : number,
    interval    : number,
    axiom_offset: number,

    // self-correction
    TT          : number,
    RT          : number,
    diff        : number,

    // observable
    clock       : number,
    cycles      : number,
    start_time  : number,
}

export interface DispatcherState {
    ns          : NS,
    active      : boolean,

    host        : string,
    target      : string,

    threads     : n_arr4,
    sources     : AxiomSrc,
}

export interface AxiomCFG {
    /**
     *  Flags:
     *  -- target   [string]
     *  -- mode     ['loop' | '<any>']
     *  -- delay    [number]
     *  -- id       [string]
     * */
    host    : string,

    target  : string,
    mode    : string,
    delay   : number,
    id      : string
}

export interface AxiomSrc {
    spoof   : string,
    exploit : string,
    deposit : string,
}