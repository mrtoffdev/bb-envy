// dev
import {NS} from "@ns";
import {AxiomCFG, AxiomSrc, DispatcherState, lock_n_arr4, n_arr4, SchedulerState, Axiom_L, XAVT} from "../../mod";
import {log} from "@tkit";

// prod
import { _SRC } from '../axioms/sourcefiles'

// standalone call
export async function main (ns: NS){

    // Demo XAVT config
    const _DEMO_XAVT: XAVT = {
        target: {
            target      : 'n00dles',
            provider    : 'home',
        },
        ASB: {
            n00dles: {
                stratagem   : ['spoof', 'exploit', 'deposit', 'exploit'],

                t_cycle_all : [0,0,0,0],
                t_cycle_max : 0,

                threads     :[0,0,0,0],
                offset      : 50
            }
        }
    }

    // Create Scheduler
    let Andromeda = new Scheduler(ns, _DEMO_XAVT);
    await Andromeda.handler(() => {

    });
}

/**--------------------------------------------------------*/
/*  Andromeda Scheduler & Dispatcher Module
/**--------------------------------------------------------*/

// ====================== Dispatcher ======================

export class Dispatcher {
    ns          : NS;
    active      : boolean;

    host        : string;
    target      : string;

    threads     : n_arr4;
    sources     : AxiomSrc;

    scheduler   : Scheduler;

    constructor(state: DispatcherState, parent: Scheduler) {
        this.ns         = state.ns;
        this.active     = state.active;

        this.host       = state.host;
        this.target     = state.target;

        this.threads    = state.threads;
        this.sources    = state.sources;

        this.scheduler  = parent;
    }

    deploy (OperationID: number): void | string{
        const UUID      = crypto.randomUUID();
        const operation = Axiom_L;
        let op_code     = 0;

        let cfg: AxiomCFG = {
            host    : this.host,
            target  : this.target,
            mode    : 'once',
            delay   : 0,
            id      : UUID,
        }

        let op_src: string = '';

        switch (OperationID) {
            case 0: op_src = this.sources.spoof;   break;
            case 1: op_src = this.sources.exploit; break;
            case 2: op_src = this.sources.deposit; break;
            case 3: op_src = this.sources.exploit; break;
            default: return "[Andromeda] : Err; Cannot identify OperationID";
        }

        // call Axiom =====

        if (op_src !== '' || op_src != undefined){
            this.ns.exec(
                op_src,
                cfg.host,
                this.threads[OperationID],
                '--target', `${this.target}`,
                '--mode', 'once',
                '--delay', 0,
                '--id', crypto.randomUUID());

            // optional log
            log (this.ns,
                'scriptlog',
                `[Andromeda] : Deployed ${operation[op_code]}`);
        } else {
            // exception log
            log (this.ns,
                'scriptlog',
                `[Andromeda] : Failed to deploy Axiom. Operation ID undefined...`);
        }



    }
}

// ====================== Scheduler ======================

export class Scheduler {

    private state       : SchedulerState;
    private schedules   : n_arr4[];
    private dispatcher  : Dispatcher;

    constructor (ns: NS, XAVT: XAVT){
        this.state      = {
            // configuration
            ns          : ns,
            active      : true,
            speed       : 20,
            interval    : 1000,
            axiom_offset: 25,

            // correction
            TT          : 0,
            RT          : 0,
            diff        : 0,

            // observable
            clock       : 0,
            cycles      : 0,
            start_time  : new Date().getTime(),
        }

        this.schedules  = [
            [0,0,0,0]
        ]

        let DispState: DispatcherState = {
            ns      : this.state.ns,
            active  : true,

            host    : 'home',
            target  : '',

            threads : [0,0,0,0],
            sources : _SRC,
        }

        this.dispatcher = new Dispatcher(DispState, this);
    }

    async handler(callback ?: (logs?: string | undefined) => any){
        while (this.state.active) {
            if (callback != undefined) callback('string');

            // handler events

            await this.check_sched((s_index: number, c_index: number) => {
                // If schedule matches, perform ff:
                this.update_sched(s_index, c_index);
                this.dispatcher.deploy(c_index);
            });

            // Clock Updates

            await this.update_clock();
            await this.state.ns.sleep(this.state.speed - this.state.diff);
        }
    }

    async update_clock(){
        // refresh clocks & enforce correction
        this.state.TT       = this.state.cycles * this.state.speed;
        this.state.RT       = new Date().getTime() - this.state.start_time;

        this.state.diff     = this.state.RT - this.state.TT;

        this.state.cycles ++;
        this.state.clock += this.state.speed;
    }

    async check_sched(callback: (s_index: number, c_index: number) => any){
        /**
         *  Function that checks the schedule collection for collisions. If a collision is found,
         *  the passed in callback function is called
         *  @callback callback
         * */

        // Iterate through all schedules
        for (let schedule of this.schedules) {

            // Iterate through all schedule cells
            for (let cell of schedule){

                if (this.state.clock >= cell) {
                    let s_index = this.schedules.indexOf(schedule);
                    let c_index = schedule.indexOf(cell);
                    callback(s_index, c_index);
                }

            }
        }
    }

    async update_sched(s_index: number, c_index: number, schedule?: n_arr4){
        /**
         *  Updates the selected schedule to contain the next execution time based on Scheduler state data.
         *  If this function received a Schedule (n_arr4), overwrite the schedule in state with the new one instead
         * */

        const Schedule  = this.schedules.at(s_index);

        if (Schedule != undefined){
            let Cell    = Schedule.at(c_index) ?? 0;
            Cell        += this.state.interval + this.state.axiom_offset;
        }
        // let table = [0,0,0,0];
        //
        // // Optional:
        //
        // if (schedule === undefined) schedule = this.schedules;
        //
        // let steps = schedule.length;
        //
        // for (let i = 0; i < steps; i++){
        //     // If on schedule range
        //     if (this.state.clock >= schedule[i]) {
        //         let original = schedule[i];
        //         // Deploy(ns, i, 'joesguns', [1,1,1,1]);
        //
        //         if (this.state.clock > schedule[i]){
        //             // ns.printf(`Drifted by ${clock - original} | Adjusting next offset of script ${i}`);
        //             // table[i] = original + ((1000 + _CONFIG.cluster_offsets) - (clock - original)); // PATCH SPACE FOR HACK
        //             table[i] = original + (this.state.interval + this.state.axiom_offset);
        //         } else {
        //             table[i] = original + (this.state.interval + this.state.axiom_offset);
        //         }
        //     } else {
        //         table[i] = schedule[i];
        //     }
        // }

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