// dev
import { NS, ScriptArg } from '@ns'

export async function main(ns: NS) {

    const _FLAGS: {[p: string]: string[] | ScriptArg} = ns.flags([
        ['target', ''],
        ['mode', 'once'],
        ['delay', 0],
        ['id', `${crypto.randomUUID()}`],
    ])

    const Target: string    = <string> _FLAGS.target;
    const Mode: string      = <string> _FLAGS.mode;
    const Delay: number     = <number> _FLAGS.delay;
    const ID: string        = <string> _FLAGS.id;

    let cycles: number = 1

    Mode == 'loop' ? ns.tail() : 0;

    while (Mode == 'loop'){
        ns.clearLog();
        ns.printf(  `Running [Spoof] in Perpetual Mode | Iterations: ${cycles}\n` +
                    `Target: ${Target} | Mode: ${Mode} | Delay: ${Delay} | ID: ${ID}`);

        await ns.hack(Target);
        await ns.sleep(Delay == 0 ? 25 : Delay);
        cycles++;
    }

    await ns.sleep(Delay);
    await ns.hack(Target);
}