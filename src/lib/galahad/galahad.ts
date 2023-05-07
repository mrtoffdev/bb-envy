// dev

import {NS} from '@ns';
import {AttackSchedule, GTarget, n_arr4, XAVT} from "./mod";

const _SRC =    {
    hack    : '/s.js',
    grow    : '/c.js',
    weaken  : '/p.js',
};

export async function main(ns: NS) {
    ns.disableLog('sleep');
    ns.disableLog('exec');
    ns.clearLog();
    ns.tail();

    // Build blank XAVT ===

    const _XAVTCFG: XAVT = Utility.generateXAVT('joesguns');

    let StartCallbacks = [... <number[]> _XAVTCFG.ASB?.durations];

    // TODO: Replace with new submodule
    // let StartCallbacks = BuildInitTable(_CONFIG.durations, _CONFIG.longest, _CONFIG.deploy_offset);

    // ========== Core Scheduler clock ==========

    let clock = 0;

    // TODO: Change const
    const cl_int = 20;

    let speed = cl_int,
        counter = 0,
        start = new Date().getTime();

    async function instance() {
        // ns.resizeTail(600, 300);     // Refreshing window

        //work out the real and ideal elapsed time
        let real    = counter * speed;
        let ideal   = new Date().getTime() - start;


        // StartCallbacks = DeployChecker(ns, clock, StartCallbacks);
        //increment the counter
        counter++;
        clock+=cl_int;

        //calculate and display the difference
        let diff = ideal - real;

        await ns.sleep(speed - diff);
        await instance();
    }

    await ns.sleep(speed)
    await instance();

    ns.printf(`Ran 10s Test`);
}

export class Galahad {

}

class Utility {

    static generateXAVT(target: string): XAVT {
        const _DEMO_MODE = true;
        const _DEMO_TARGET: GTarget = {
            target      : 'joesguns',
            provider    : 'home'
        }

        const _DEMO_ATTACKSCHED: AttackSchedule = {
            stratagem   : ['spoof', 'exploit', 'deposit', 'exploit'],
            durations   : [1603, 6413, 5130, 6413],
            threads     : [88,98,1710,98],
            offset      : 50,
        }

        return {
            target      : _DEMO_TARGET,
            ASB         : _DEMO_ATTACKSCHED,
        };
    }

}

/**
 * @param {n_arr4} DURATIONS
 * @param {number} RUNTIME
 * @param {number} OFFSET
 * */
function BuildInitTable(DURATIONS: n_arr4, RUNTIME: number, OFFSET: number){
    let out = [];
    for (let i = 0; i < DURATIONS.length; i++){
        out[i] = (RUNTIME - DURATIONS[i]) + (i*OFFSET);
    }
    return out;
}

/**
 * @param {NS} ns
 * @param {number} clock
 * @param {n_arr4} schedule
 * @param {number} cluster_offsets
 * */
function DeployChecker(ns: NS, clock: number, schedule: n_arr4, cluster_offsets: number){
    let table = [0,0,0,0];
    let steps = schedule.length;

    for (let i = 0; i < steps; i++){
        // If on schedule range
        if (clock >= schedule[i]) {
            let original = schedule[i];
            // Deploy(ns, i, 'joesguns', [1,1,1,1]);

            if (clock > schedule[i]){
                // ns.printf(`Drifted by ${clock - original} | Adjusting next offset of script ${i}`);
                // table[i] = original + ((1000 + _CONFIG.cluster_offsets) - (clock - original)); // PATCH SPACE FOR HACK
                table[i] = original + (1000 + cluster_offsets);
            } else {
                table[i] = original + (1000 + cluster_offsets);
            }
        } else {
            table[i] = schedule[i];
        }
    }

    return table;
}

/**
 * @param {import("../../index").NS} ns
 * @param {number} OPERATION
 * @param {string} target
 * @param {n_arr4} threads
 * */


/**
 *  @param {import("../../index").NS} ns
 *  @param {number} opcode
 *  @param {string} UUID
 * */
function SimpleLog(ns: NS, opcode: number, UUID: string){
    let operation = opcode == 0 ?
        `Hack` :
        opcode == 1 ?
            `Weaken I` :
            opcode == 2 ?
                `Grow` :
                opcode == 3 ?
                    `Weaken II` :
                    ``;
    // let dialogue =  `\u001b[38;5;214m[Target]\u001b[0m ${target} `+
        `\u001b[38;5;214m[Operation]\u001b[0m ${operation} `+
        // `\u001b[38;5;214m[Threads]\u001b[0m ${_CONFIG.threads[opcode]} `+
        `\u001b[38;5;214m[UUID]\u001b[0m ${UUID}`;
        let dialogue = 'test';

    ns.printf(`${dialogue}`);
}

function ClockV2() {
    // ns.disableLog('sleep');
    // let timeouts = {};
    // let speed = 50,
    // 	counter = 0,
    //     start = new Date().getTime();

    // async function instance() {
    //     ns.resizeTail(600, 300);
    //     //work out the real and ideal elapsed time
    //     let real = counter * speed,
    //         ideal = new Date().getTime() - start;

    //     //increment the counter
    //     counter++;

    //     //calculate and display the difference
    //     let diff = ideal - real;
    //     ns.clearLog();
    //     ns.printf(`Expected: ${real}`);
    // 	ns.printf(`Real: ${real}`);
    //     ns.printf(`Diff: ${diff}`);

    //     await ns.sleep(speed - diff);
    //     await instance();
    // }

    // await ns.sleep(speed)
    // await instance();
}