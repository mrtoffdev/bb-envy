// dev
import {NS} from '@ns';
import {AttackScheduleBlueprint, GalahadState, GTarget, n_arr4, SchedulerState, XAVT} from "./mod";



export async function main(ns: NS) {

    // disable misc logs ========================

    ns.disableLog('sleep');
    ns.disableLog('exec');
    ns.clearLog();
    ns.tail();

    // initialize Galahad

    const _XAVTCFG: XAVT = Galahad.generateXAVT('joesguns');

}

/**--------------------------------------------------------*/
/*  Galahad Supervisor Module
/**--------------------------------------------------------*/

export class Galahad {

    // ====================== Props ======================

    state: GalahadState;

    constructor() {
        this.state = {
            clusternet: []
        };
    }

    // ====================== Config Utilities ======================

    static generateXAVT(target: string): XAVT {
        const _DEMO_MODE = true;
        if (target == undefined){

            // demo configuration ======

            const _DEMO_TARGET: GTarget = {
                target      : 'joesguns',
                provider    : 'home'
            }

            const _DEMO_ATTACKSCHED: AttackScheduleBlueprint = {
                stratagem   : ['spoof', 'exploit', 'deposit', 'exploit'],
                t_cycle_all : [1603, 6413, 5130, 6413],
                threads     : [88,98,1710,98],
                offset      : 50,
            }

            return {
                target      : _DEMO_TARGET,
                ASB         : _DEMO_ATTACKSCHED,
            };
        }
    }

    static deployScheduler () {

    }
}
