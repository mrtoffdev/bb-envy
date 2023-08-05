import {Eulrvisor} from "../Eulrvisor";

const _DEBUG_MODE = false;

// dev
import {NS} from "@ns";
import {Fafnircfg, GraphNetworkNode, NetworkList, NetworkStack} from "../mod";

// prod
import {Exploit, ExploitCmd, ExploitDB, isExploitCmd} from "../../../envy";

export class FafnirInterface {

    public static AutoExploit(ns: NS, networkStack: NetworkStack, target?: string){

        const tools: ExploitCmd[]   = fetchTools(ns);
        const { ReferenceTable }    = networkStack;    // <---- use RefTable for faster iteration

        for (let Node of ReferenceTable) {
            // if un-pwned, run through all exploits available
            if (!Node.Pwned) {
                brutePwn(ns, Node.Name, tools);
            }
        }

        //#region autoexploit utilities =====

        function brutePwn(ns: NS, target: string, programs: ExploitCmd[]){
            for (let program of programs) {
                if (isExploitCmd(program)) {
                    ns[program](target);    // <---- unintended RAM evasion
                }
            }
        }

        function fetchTools(ns: NS): ExploitCmd[]{
            const files = ns.ls('home');
            let tools: ExploitCmd[] = [];
            for (let file of files){
                if (isExploitCmd(file)) tools.push(file);
            }
            return tools;
        }

        //#endregion
    }
}

export async function Fafnir(ns: NS, _CONFIG: Fafnircfg){
    // network stack
    const { NameTable,
            ReferenceTable,
            LayerTable } = _CONFIG.networkStack;

    // for untargetted autoexploit
    FafnirInterface.AutoExploit(ns, _CONFIG.networkStack);
}

function SortNetwork() {

}
