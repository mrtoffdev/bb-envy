// Primitives
import {NS} from "../../index";

export type n_arr4 = [number, number, number, number];

//#region Strategy type-guards & defs
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

