// dev
import {NS} from "../../../../index";

// prod

export async function main (ns: NS){

}

export class Scheduler {
    ns          : NS;
    active      : boolean;

    clock       : number;
    speed       : number;
    cycles      : number;
    start_time  : number;
    TT          : number;
    RT          : number;
    offset      : number;

    constructor (ns: NS, clock_speed: number){

        this.ns         = ns;
        this.active     = true;

        this.start_time = new Date().getTime();
        this.cycles     = 0;
        this.clock      = 0;
        this.speed      = clock_speed;
        this.offset     = 0
        this.RT         = 0;
        this.TT         = 0;
    }

    async handler (callback ?: (logs ?: string) => {}){
        while (this.active) {
            if (callback != undefined) callback();

            // handler events


            this.TT = this.cycles * this.speed;
            this.RT = new Date().getTime() - this.start_time;
            this.offset = this.RT - this.TT;

            await this.ns.sleep(this.speed - this.offset);
        }
    }
}