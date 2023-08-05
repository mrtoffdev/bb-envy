// dev
import { NS } from '../index'

// prod
import { Eulrvisor, BuildConfig } from '../lib/eulrvisor/Eulrvisor';
import { _DEFAULT_CONFIG} from "../lib/eulrvisor/Eulrvisor";

export async function main(ns: NS) {
    const _FLAGS		= ns.flags([
        ['mode', 'list'],
        ['export', true],
        ['out', 'vx_eulr.js'],
    ]);

    // Can be run using flags w/ BuildConfig
    await Eulrvisor(ns, BuildConfig(_FLAGS, undefined));

    // Or with internal default config
    // await Eulrvisor(ns, _DEFAULT_CONFIG);
}


