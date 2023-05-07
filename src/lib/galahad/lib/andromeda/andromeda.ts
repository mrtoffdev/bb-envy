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
        ns         : ns,
        active     : true,

        start_time : new Date().getTime(),
        cycles     : 0,
        clock      : 0,
        speed      : 20,
        offset     : 0,
        RT         : 0,
        TT         : 0,
    }
}

export class Scheduler {
    
    state       : SchedulerState;

    constructor (ns: NS, state: SchedulerState){
        this.state      = state;
    }

    async handler (callback ?: (logs ?: string) => {}){
        while (this.state.active) {
            if (callback != undefined) callback();

            // handler events



            // refresh clocks & enforce correction

            this.state.TT       = this.state.cycles * this.state.speed;
            this.state.RT       = new Date().getTime() - this.state.start_time;
            this.state.offset   = this.state.RT - this.state.TT;

            await this.state.ns.sleep(this.state.speed - this.state.offset);
        }
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
}