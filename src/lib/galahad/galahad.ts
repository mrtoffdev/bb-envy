// dev

import {NS} from '@ns';
import {AttackSchedule, GTarget, n_arr4, XAVT} from "./mod";

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