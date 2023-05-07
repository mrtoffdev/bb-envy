/**
 *  ================== Fafnir ==================
 *  An automated network intrusion module primarily
 *  built to assist intrusion schedulers such as
 *  Galahad, but can also be used for Singularity
 *  functions, network traversal, etc.
 *
 *  Dependencies:
 *  - Eulrvisor OR Eulrvisor generated network map
 *
 **/
const _DEBUG_MODE = false;

// dev
import {NS} from "../../../index";
import {NetworkList} from "../mod";

// prod
import {ExploitDB} from "../../../envy";
import { log } from "../../tkit/Toolkit";

export async function Fafnir(ns: NS, _CONFIG: Fafnircfg){
    const _NETWORK =  _CONFIG.network;
    let NetworkNodes;

    if (typeof _NETWORK == "string"){
        // Treat _NETWORK as a file url
        await import("../Eulrvisor").then(module => {
            NetworkNodes = module.Eulrvisor(ns);
        })
    } else
    if (Array.isArray(_NETWORK) && (typeof _NETWORK[0] == "string")){
        // Treat _NETWORK as NetworkGraph
    }

    // Fetch all target-able servers.hackinglvl <= player.hackinglvl & player.exploit

}

function SortNetwork() {

}

//#region Fafnir Interface ===================================

/**
 *  Fafnir type-guards & definitions
 * */

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
    network: string | NetworkList
    singularity: boolean,
}
const FafnirRuntimeModeL = ['module', 'standalone', undefined] as const;
export type FafnirRuntimeMode = (typeof FafnirRuntimeModeL)[number];

//#endregion