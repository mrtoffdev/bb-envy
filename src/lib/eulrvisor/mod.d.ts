import {NS} from "@ns";
import {Eulrcfg} from "./Eulrvisor";

export type TableCell = [string, number];

// not to be mixed with NSServer, which is a Server object directly referenced from the NS instance
export interface NetworkStack {

    // beta
    NameTable       : string[];
    ReferenceTable  : NetworkNode[];
    LayerTable      : NetworkNode[][];

    // ServerNames     : string[],
    // Tables          : simpletable,
    // Root            : GraphNetworkNode | undefined;
}

type simpletable = [[table: string],[[key: string], undefined]];

export interface Server {

}

export interface NetworkNode {
    Name        : string,
    GrowthRate  : number,
    HackLvl     : number,
    Pwned       : boolean,
}

export interface GraphNetworkNode extends NetworkNode, Position {
    // Children: {[k: string]: any}
    Children    ?: NetworkList
}

export interface Position {
    Parent      : string,
    Depth       : number,
    Position    : number[],
}

export type NetworkList = GraphNetworkNode[];

//#region Eulrvisor Interface ===================================

/**
 *  Eulrvisor mode type-guard & definition
 * */

// Default config for empty call
const _DEFAULTFLAGS: SchemaObj      = {
    mode: 'list',
    export: true,
    out: 'vx_eulr.js',
}
const EulrRuntimeModeL = [
    'table',
    'graph',
    'list',
    'search',
    undefined
] as const;

export type EulrRuntimeMode = (typeof EulrRuntimeModeL)[number];
export function isEulrRuntimeMode(In: any): In is EulrRuntimeMode {
    return EulrRuntimeModeL.indexOf(In) !== -1;
}

type Schema = [string, (string | number | boolean | string[])][];
type SchemaObj = {[p: string]: string[] | ScriptArg};

// Config builder
export function BuildConfig(_FLAGS: SchemaObj = _DEFAULTFLAGS,
                            log: string | undefined = '/log/L_Eulr.txt'): Eulrcfg {
    return {
        mode: isEulrRuntimeMode(_FLAGS.mode) ? _FLAGS.mode : undefined,
        log: log,
        export: (typeof _FLAGS.export == "boolean") ? _FLAGS.export : false,
        out: `${_FLAGS.out}`,
    }
}

// Eulrvisor Config interface
/**
 *  @property {EulrRuntimeMode} mode,
 *  @property {string | undefined} log
 *  @property {boolean} export
 *  @property {string} out
 * */
export interface Eulrcfg {
    mode: EulrRuntimeMode,
    log: string | undefined
    export: boolean
    out: string,
}

//#endregion

//#region Fafnir Interface ===================================
/**
 *  ================== Fafnir ==================
 *  An automated network intrusion module primarily
 *  built to assist intrusion schedulers such as
 *  Galahad, but can also be used for Singularity
 *  functions, network traversal, etc.
 *
 *  Dependencies:
 *      - Eulrvisor OR Eulrvisor generated network map
 */

/**
 *  Fafnir type-guards & definitions
 */

export function isFafnirRuntimeMode(In: any): In is FafnirRuntimeMode {
    return FafnirRuntimeModeL.indexOf(In) !== -1;
}

/** Fafnir Config interface
 *  @property {FafnirRuntimeMode} mode
 *  @property {string} log
 *  @property {boolean} singularity
 * */
export interface Fafnircfg {
    mode: FafnirRuntimeMode,
    log: string,
    networkStack: NetworkStack
    singularity: boolean,
}

const FafnirRuntimeModeL = ['module', 'standalone', undefined] as const;
export type FafnirRuntimeMode = (typeof FafnirRuntimeModeL)[number];

//#endregion
