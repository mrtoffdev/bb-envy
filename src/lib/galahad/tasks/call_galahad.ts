// dev
import {NS} from "@ns";

// prod

export async function main(ns: NS) {
    ns.disableLog('sleep');
    ns.disableLog('exec');
    ns.clearLog();
    ns.tail();


    ns.printf(`Ran 10s Test`);
}