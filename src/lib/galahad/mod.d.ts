// Primitives
import {NS} from "@ns";

export type n_arr4      = [number, number, number, number];
export type lock_n_arr4 = readonly [number, number, number, number];

//#region Galahad type-guards & defs
export {Strategy_L, Strategy, Stratagem, isStrategy};

const Strategy_L = [
    'spoof',
    'exploit',
    'deposit'
] as const;

type Stratagem      = Strategy[];
type Strategy       = (typeof Strategy_L)[number];

const isStrategy    = (In: any): In is Strategy => {
    return Strategy_L.indexOf(In) !== -1;
}
//#endregion

//#region XAVT

export {XAVT, GTarget, AttackSchedule,SchedUnit, SRAT}

interface XAVT {
    target  : GTarget,
    ASB     ?: AttackSchedule,
    SRAT    ?: SRAT,
}

interface GTarget {
    target      : string,
    provider    : string,
}

interface AttackSchedule {
    stratagem   : Stratagem,
    durations   : n_arr4,
    threads     : n_arr4,
    offset      : number,
}

interface SchedUnit {
    cycle_duration  : number,
    target_clusts   : number,
    offsets         : n_arr4,
    intervals       : number,
}

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

//#region Andromeda
export interface SchedulerState {
    ns          : NS,
    active      : boolean,

    clock       : number,
    speed       : number,
    cycles      : number,
    start_time  : number,
    TT          : number,
    RT          : number,
    interval    : number,
    axiom_offset: number,
}

export interface AxiomCFG {
    /**
     *  Flags:
     *  -- target   [string]
     *  -- mode     ['loop' | '<any>']
     *  -- delay    [number]
     *  -- id       [string]
     * */
    target: string,
    mode: string,
    delay: number,
    id: string
}

export interface AxiomSrc {
    spoof   : string,
    exploit : string,
    deposit : string,
}