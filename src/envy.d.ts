//#region === Number Formats ===
/**
 *  ================== Number Formats ==================
 **/
import {TableDB} from '@tkit';
import {FafnirRuntimeMode, FafnirRuntimeModeL} from "./lib/eulrvisor/mod";

export {EDataFormat, EUnitFormat, ETimeFormat};
export type Format = DataFormat | UnitFormat | TimeFormat;
// Data format type-guard & definition
const DataFormatL = ['gb', 'tb', 'pb', 'eb'] as const;
export type DataFormat = (typeof DataFormatL)[number];
export function isDataFormat(In: any): In is DataFormat {
    return DataFormatL.indexOf(In) !== -1;
}
const EDataFormat = {
    gb: 1,
    tb: 1e3,
    pb: 1e6,
    eb: 1e9,
}

// Unit format type-guard & definition
const UnitFormatL = ['K', 'M', 'B', 'T', 'q', 'Q', 'S'] as const;
export type UnitFormat = (typeof UnitFormatL)[number];
export function isUnitFormat(In: any): In is UnitFormat {
    return UnitFormatL.indexOf(In) !== -1;
}
const EUnitFormat = {
    K: 1e3,
    M: 1e6,
    B: 1e9,
    T: 1e12,
    q: 1e15,
    Q: 1e18,
    S: 1e21,
}

// Time format type-guard & definition
const TimeFormatL = ['ms', 's', 'm', 'h', 'd', 'w'] as const;
export type TimeFormat = (typeof TimeFormatL)[number];
export function isTimeFormat (In: any): In is TimeFormat {
    return TimeFormatL.indexOf(In) !== -1;
}
const ETimeFormat = {
    ms: 1,
    s: 1e3,
    m: 6e4,
    h: 36e5,
    d: 864e5,
    w: 6048e5,
};

//#endregion

//#region === Common Data Types ===
export type TableCell = [string, number];
//#endregion

//#region === Exploit Programs (Built in) ===

export class ExploitDB {
    name: string = "ExploitDB";
    public static exploits: Exploit[] = [
        {
            file        : 'BruteSSH.exe',
            cmd         : 'brutessh',
            serverprop  : 'sshPortOpen',
            port        : 'ssh',
            cost        : 500000,
            lvl         : 50
        },
        {
            file        : 'FTPCrack.exe',
            cmd         : 'ftpcrack',
            serverprop  : 'ftpPortOpen',
            port        : 'ftp',
            cost        : 500000,
            lvl         : 100
        },
        {
            file        : 'relaySMTP.exe',
            cmd         : 'relaysmtp',
            serverprop  : 'smtpPortOpen',
            port        : 'smtp',
            cost        : 500000,
            lvl         : 250
        },
        {
            file        : 'HTTPWorm.exe',
            cmd         : 'httpworm',
            serverprop  : 'httpPortOpen',
            port        : 'http',
            cost        : 500000,
            lvl         : 250
        },
        {
            file        : 'SQLInject.exe',
            cmd         : 'sqlinject',
            serverprop  : 'sqlPortOpen',
            port        : 'sql',
            cost        : 500000,
            lvl         : 250
        },
        {
            file        : 'NUKE.exe',
            cmd         : 'nuke',
            serverprop  : 'hasAdminRights',
            port        : 'shell',
            cost        : 0,
            lvl         : 0
        }
    ];

    run (Callback: (value: Exploit, index: number, array: Exploit[]) => void) {
        this.exploits.forEach(Callback);
    }

}

export interface Exploit {
    file: string,
    cmd: string,
    serverprop: string,
    port: string,
    cost: number,
    lvl: number,
}

const ExploitCmdL = ['brutessh', 'ftpcrack', 'relaysmtp', 'httpworm', 'sqlinject', 'nuke'] as const;
export type ExploitCmd = (typeof ExploitCmdL)[number];
export function isExploitCmd(In: any): In is ExploitCmd {
    return ExploitCmdL.indexOf(In) !== -1;
}
//#endregion

