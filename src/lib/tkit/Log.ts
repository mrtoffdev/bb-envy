// dev
import {NS} from "@ns";

const _DEBUG_MODE = true;
export function log(ns: NS, term: string, log: string, extend?: LogExtension | LogExtension[]){
    const terminal = (term === 'term') ?
            (input: string) => ns.tprintf(input) :
            (input: string) => ns.printf(input);

    let f_log: string = `${log}`;


    terminal(log);
}

// Extensions
function extendLog(log: string, extension: LogExtension){
    switch (typeof extension){

    }
}

export type LogExtension = DES;

/**
 *  Extension data for showing Andromeda deploy logs
 *  @property {'deposit' | 'exploit' | 'hack'} operation
 *  @property {string} target
 *  @property {number} duration
 * */
export type DES = {
    operation   : 'deposit' | 'exploit' | 'spoof',
    target      : string,
    duration    : number,
};

export function getExtensionType(extension: LogExtension): string {
    return '';
}