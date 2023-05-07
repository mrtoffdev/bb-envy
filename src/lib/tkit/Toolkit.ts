// dev
import {TableCell} from "../../envy";
import {ScriptArg, NS} from "@ns";
import {DataFormat, UnitFormat, TimeFormat} from "../../envy";

// prod
import {isDataFormat, isTimeFormat, isUnitFormat,
        EDataFormat, EUnitFormat, ETimeFormat} from "../../envy";

/**
 * @param {number} Input - Requires base value of Formats; i.e. ms for Time, GB for RAM, ones for Cash, etc.
 * @param {DataFormat | UnitFormat | TimeFormat} IType = Target format of return value
 * @param {number} DecPlaces - Decimal places to round return value to (Optional: Defaults to **2 decimal places**)
 * @param {string} RoundType - Mode of rounding (Floor | Ceil) (Optional: Defaults to **ceil**)
 * @param {boolean} AddPref - Adds a prefix to the output for simpler print arguments (Optional: Defaults to **false**)
 * @return {string | number} - Returns either a **string** w/ prefix (Ideal for logs) or a **number** (Ideal for scripts)
 * */
export function convert(Input: number,
                 IType: DataFormat | UnitFormat | TimeFormat,
                 DecPlaces: number = 2,
                 RoundType: string = 'c',
                 AddPref: boolean = false): string | number {

    let returnable: number | string;

    // convert to target data type
    if (isDataFormat(IType)) {
        switch (IType) {
            case "gb": returnable = Input / EDataFormat.gb; break;
            case "tb": returnable = Input / EDataFormat.tb; break;
            case "pb": returnable = Input / EDataFormat.pb; break;
            case "eb": returnable = Input / EDataFormat.eb; break;
            default: returnable = -1; break;
        }
    } else
    if (isUnitFormat(IType)) {
        switch (IType) {
            case "K": returnable = Input / EUnitFormat.K; break;
            case "M": returnable = Input / EUnitFormat.M; break;
            case "B": returnable = Input / EUnitFormat.B; break;
            case "T": returnable = Input / EUnitFormat.T; break;
            case "q": returnable = Input / EUnitFormat.q; break;
            case "Q": returnable = Input / EUnitFormat.Q; break;
            case "S": returnable = Input / EUnitFormat.S; break;
        }
    } else
    if (isTimeFormat(IType)) {
        switch (IType) {
            case "ms": returnable = Input / ETimeFormat.ms; break;
            case "s": returnable = Input / ETimeFormat.s; break;
            case "m": returnable = Input / ETimeFormat.m; break;
            case "h": returnable = Input / ETimeFormat.h; break;
            case "d": returnable = Input / ETimeFormat.d; break;
            case "w": returnable = Input / ETimeFormat.w; break;
        }
    }
    return '';

    function fc(In: number, Op: string = 'c'): number {
        return  Op === 'f' ? Math.floor(In) :
                Op === 'c' ? Math.ceil(In) : 0;
    }

    function cdata(In: number):number {
        return 1;
    }
}

//#region === TUI ===
export function printTable(ns: NS, Title: string, Term: string, Arr: TableCell[]): void{
    const _TERM = Term;
    ns.tprintf(`${Title}\n`);
    Arr.forEach((Item: TableCell)=>{
        let L = Item[0];
        let R = Item[1].toString();

        L += ' '.repeat((L.length > 30) ? 0 : 30 - L.length);
        R += ' '.repeat((R.length > 30) ? 0 : 30 - R.length);

        print(`┃ ${L} ┃ ${R} ┃\n`);
    });

    function print(Log: string){
        ns[`${_TERM == 'log' ? 'printf' : 'tprintf'}`](`${Log}`);
    }
}

// TableDB =================================
export interface TDBRequest {
    type    : TDBTransaction,
    target  : string,
    value   ?: string | string[],
}

export interface TDBResponse {
    caller      : TDBTransaction,
    target      : string,
    response    : string | string[] | {[key: string]: any}
}

const TDBTransactionL = ['open', 'read', 'write', 'search'] as const;
export type TDBTransaction = (typeof TDBTransactionL)[number];
export function isTDBTransaction(In: any): In is TDBTransaction {
    return TDBTransactionL.indexOf(In) !== -1;
}

const TDBWriteOptionL = ['open', 'read', 'write', 'search'] as const;
export type TDBWriteOption = (typeof TDBWriteOptionL)[number];
export function isTDBWriteOption(In: any): In is TDBWriteOption {
    return TDBWriteOptionL.indexOf(In) !== -1;
}

export interface WriteTransaction {
    mode    : WriteMode,
    table   : string,
    key     : string,
    value   : any,
}
type Store = {[key: string]: any} | []
export type DBInstance  = {[Table: string]: Store};

type WriteMode = 'write' | 'append' | 'delete'

export class TableDB {
    DBInstance: DBInstance;

    constructor(Callback?: Function) {
        this.DBInstance = {
            ['']: {
                ['']: undefined
            }
        };
    }

    public write(Request: WriteTransaction){
        switch (Request.mode) {
            case "write":
                break;
            case "append":
                break;
            case "delete":
                break;
            default:
                break;
        }
    }

    private fetchStore (Table: string): Store | undefined {
        if (this.DBInstance[Table]){
            return this.DBInstance[Table];
        }
        return undefined;
    }
}


class Transaction {

}

export const Handle = (Request: TDBTransaction, Target: string, TableDBInstance: TableDB, Value ?: any,): void => {
    switch (Request) {
        case 'open':
            // TableDBInstance.push([Value, ["", undefined]]);
            break;
        case 'read':
            break;
        case 'write':
            break;
        case 'search':
            break;
        default:
            break;
    }
}
//#endregion

//#region Dev Tools
const _DEBUG_MODE = true;
export function log(ns: NS, term: string, log: string){
    if (_DEBUG_MODE){
        switch (term){
            case 'term':
                ns.tprintf(log);
                break;
            case 'scriptlog':
            default:
                ns.printf(log);
                break;
        }
    }
}
//#endregion