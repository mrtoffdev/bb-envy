// dev
import {NS} from "@ns";
import {AxiomCFG, AxiomSrc, lock_n_arr4, n_arr4, SchedulerState, Strategy_L} from "../../mod";
import {log} from "@tkit";

// prod
import { _SRC } from '../axioms/sourcefiles'

// let _SRC: AxiomSrc;
// const _SRC_DIR = '/lib/galahad/lib/axioms/sourcefiles.txt'

export async function main (ns: NS){

    const InitSchedulerState: SchedulerState = {
        ns          : ns,
        active      : true,

        start_time  : new Date().getTime(),
        cycles      : 0,
        clock       : 0,
        speed       : 20,
        RT          : 0,
        TT          : 0,
        interval    : 1000,
        axiom_offset: 25,
    }

    // Create Scheduler

    let Andromeda = new Scheduler(ns, InitSchedulerState);
    await Andromeda.handler(() => {

    })
}

export class Scheduler {
    
    state       : SchedulerState;
    schedule    : n_arr4;

    constructor (ns: NS, state: SchedulerState){
        this.state      = state;
        this.schedule   = [0, 0, 0, 0];
    }

    async handler(callback ?: (logs?: string | undefined) => any){
        while (this.state.active) {
            if (callback != undefined) callback('string');

            // handler events



            // refresh clocks & enforce correction

            this.state.TT       = this.state.cycles * this.state.speed;
            this.state.RT       = new Date().getTime() - this.state.start_time;
            const diff          = this.state.RT - this.state.TT;

            await this.state.ns.sleep(this.state.speed - diff);
        }
    }

    async update_sched(ns: NS, index: number, schedule?: n_arr4){
        let table = [0,0,0,0];

        if (schedule === undefined) schedule = this.schedule;

        let steps = schedule.length;

        for (let i = 0; i < steps; i++){
            // If on schedule range
            if (this.state.clock >= schedule[i]) {
                let original = schedule[i];
                // Deploy(ns, i, 'joesguns', [1,1,1,1]);

                if (this.state.clock > schedule[i]){
                    // ns.printf(`Drifted by ${clock - original} | Adjusting next offset of script ${i}`);
                    // table[i] = original + ((1000 + _CONFIG.cluster_offsets) - (clock - original)); // PATCH SPACE FOR HACK
                    table[i] = original + (this.state.interval + this.state.axiom_offset);
                } else {
                    table[i] = original + (this.state.interval + this.state.axiom_offset);
                }
            } else {
                table[i] = schedule[i];
            }
        }

        return table;
    }

    Deploy(ns: NS, OPERATION: number, target: string, threads: lock_n_arr4){
        const UUID      = crypto.randomUUID();
        const operation = Strategy_L;
        let op_code     = 0;

        let cfg: AxiomCFG = {
            target  : target,
            mode    : 'once',
            delay   : 0,
            id      : UUID,
        }
        switch (OPERATION) {
            case 0:
                ns.exec(_SRC.spoof, 'home', threads[0], target, 0, UUID, 0);
                op_code = 0;
                break;
            case 1:
                ns.exec(_SRC.exploit, 'home', threads[1], target, 0, UUID, 0);
                op_code = 1;
                break;
            case 2:
                ns.exec(_SRC.deposit, 'home', threads[2], target, 0, UUID, 0);
                op_code = 2;
                break;
            case 3:
                ns.exec(_SRC.exploit, 'home', threads[3], target, 0, UUID, 0);
                op_code = 1;
                break;
            default:
                ns.exit();
        }

        log (ns, 'scriptlog', `[Andromeda] : Deployed ${operation[op_code]}`)
    }

    /**
     * @param {n_arr4} DURATIONS
     * @param {number} RUNTIME
     * @param {number} OFFSET
     * */
    BuildInitTable(DURATIONS: n_arr4, RUNTIME: number, OFFSET: number){
        let out = [];
        for (let i = 0; i < DURATIONS.length; i++){
            out[i] = (RUNTIME - DURATIONS[i]) + (i*OFFSET);
        }
        return out;
    }
}