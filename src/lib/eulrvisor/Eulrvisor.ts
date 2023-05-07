/**
 *  ================== Eulrvisor ==================
 *  A network forensics toolkit designed to be
 *  integrated into the Deios System. Operations
 *  include; network building | scanning, analysis,
 *  integration w/ other analysis & intrusion
 *  modules such as Galahad & Hookshell.
 *
 *  Implementation:
 *  Recursive DFS based Object Builder that takes a blank
 *  mutable origin network node and recursively builds its
 *  data
 *
 **/

//#region imports
// dev
import {GraphNetworkNode, NetworkList, NetworkNode, NetworkStack, Position, TableCell} from "./mod";

import {NS, ScriptArg} from '../../index'

// prod
import {log, printTable} from "../tkit/Toolkit"
//#endregion

const _DEBUG_MODE: boolean      = false;
const _TRACK_POSITION:boolean   = false;

// Global
let ServerNames: string[]           = [];
let OrderByHackTime: TableCell[]    = [
    ['MEDIAN', 0],
];

// Defaults
export const _DEFAULT_CONFIG: Eulrcfg   = {
    mode: 'table',
    log: '/log/L_Eulr.txt',
    export: true,
    out: 'vx_eulr.js'
}
const InitPosition = {
    Parent      : "NULL",
    Depth       : 0,
    Position    : [0],
}

export async function Eulrvisor(ns: NS, _CONFIG: Eulrcfg = _DEFAULT_CONFIG): Promise<GraphNetworkNode> {
    ns.ui.clearTerminal();

    // Network Stack for current instance
    let OutNetworkStack: NetworkStack = {
        Root: undefined,
        ServerNames: [],
        Tables: [[""],[[""], undefined]],
    }

    // Runtime Configurations
    const BM1: number                   = performance.now();
    const _MAX_DEPTH: number            = 15;
    let GlobalNetworkList: NetworkList  = [];

    // Build Root Network Node
    let Root: GraphNetworkNode = {
        Name        : ns.getHostname(),
        GrowthRate  : -77,
        HackLvl     : -77,
        Pwned       : false,

        Parent      : "NULL",
        Depth       : 0,
        Position    : [0],

        Children    : [],
    }
    OutNetworkStack.Root = Root;

    // Build Root Node
    Root.Children = crawl(ns, Root, InitPosition, _MAX_DEPTH, Root.Position, GlobalNetworkList);

    if (_CONFIG.export){
        ns.write(_CONFIG.out, JSON.stringify(Root), "w");
    }

    // Runtime Options
    switch (_CONFIG.mode) {

        // Plaintxt readable data formats ===========

        case 'table':
            ns.tprintf(`Server List: ${ServerNames}`);
            printTable(ns, "Order By Hack Time:", 'log', OrderByHackTime);
            ns.tprint(`Execution Time: ${performance.now() - BM1}ms`);
            break;

        // Object data formats ===========

        case 'graph':
            log(ns, 'term', `STRINGIFY: ${JSON.stringify(Root)}`)
            ns.tprint(`Execution Time: ${performance.now() - BM1}ms`);
            break;
        case 'list':
            log(ns, 'term', `${JSON.stringify(GlobalNetworkList)}`);
            log(ns, 'term', `Execution Time: ${performance.now() - BM1}ms`);
            break;
        case 'search':

            break;
        default:
            ns.tprintf(`Err: View mode not found`);
            break;
    }
    return Root;
}

/**
 * @param {NS} ns - NS Instance
 * @param {GraphNetworkNode} Node - The Node to be processed
 * @param {Position} ChildPosition - The Node to be processed
 * @param {number} MaxDepth - Recursion depth delimiter
 * @param {number[]} NodePath - Node position path
 * @param {NetworkList} GlobalNet
 */
function crawl(ns: NS,
               Node: GraphNetworkNode,
               ChildPosition: Position,
               MaxDepth: number,
               NodePath: number[],
               GlobalNet: NetworkNode[]): GraphNetworkNode[] {

    /**
     *  Crawler recursive functionality:
     *      1. We get root network node (usually home; is object type NetworkNode [Not String])
     *      2. Grab details fromm NetworkNode instance e.g. Name, Parent, Etc.
     *      2.1 Children list will always be empty
     *      3. Generate children list in Crawler (is object type NetworkNode [Not String])
     *      4. Recurse
     *
     *  Sub functionality:
     *      1. Push Base NetworkNode (Not GraphNetworkNode) to table (sort)
     * */

    // Top level variables

    // Push to server list (Optional)
    ServerNames.push(Node.Name);
    let LocalNodePosition = [...NodePath];

    // Push Node Object to GlobalNet (Optional)
    let BNN: NetworkNode = {
        Name: Node.Name,
        GrowthRate: Node.GrowthRate,
        HackLvl: Node.HackLvl,
        Pwned: Node.Pwned
    }
    GlobalNet.push(BNN);

    // Push Node Object to sorted table (Optional)
    orderedPush(ns, Node);

    // Overwrite InitPosition w/ inherited Position data
    Node.Parent = ChildPosition.Parent;
    Node.Depth = ChildPosition.Depth;
    Node.Position = _TRACK_POSITION ? ChildPosition.Position : [0];

    // Create an array of blank children nodes
    let GNNChildren: GraphNetworkNode[] = ns.scan(Node.Name).filter((NodeName) => {
        return (NodeName != ns.getHostname() && NodeName != Node.Parent);
    }).map((value) => {
        return buildNode(ns, value, InitPosition);
    });

    log(ns, `scriptlog`, `Current Node's Children; ${JSON.stringify(Node.Children)}`);
    // Fills blank children nodes w/ data recursively
    try {
        if(GNNChildren.length > 0 && ChildPosition.Depth < MaxDepth) {
            // log(ns, 'term', `Current Node: ${Node} | Children Found: ${Str_Child}`);
            let ctr2 = 0;
            for (let Child of GNNChildren) {

                // Generate new position data for children
                LocalNodePosition.push(ctr2);
                const NewDepth = ChildPosition.Depth + 1;
                const NewPosition: Position = {
                    Parent: Node.Name,
                    Depth: NewDepth,
                    Position: LocalNodePosition,
                }
                Child.Children = crawl(ns, Child, NewPosition, MaxDepth, LocalNodePosition, GlobalNet);

                // log(ns, 'term', `Finished Recursion Tree | Result: ${BaseChildNodes[`${CNode}`].Name}`);
                ctr2++;
            }
            // log(ns, 'term',`Test before return: ${JSON.stringify(BaseNode)}`);
            return GNNChildren;
        }
    } catch (E) {
        // log(ns, 'term',`Crawler function error: \n${E}`);
    }
    return GNNChildren;
}

/**
 *  @param {string} Host - Target host to look for
 *  @param {GraphNetworkNode} Root - Network Graph (Reference 1)
 *  @param {GraphNetworkNode[]} ReferenceTable - Addr list of networks to fetch path data from
 * */
function locate(Host: string, Root: GraphNetworkNode, ReferenceTable: GraphNetworkNode[]): string {
    // TODO: Probably change position props
    return '';
}

function sort(){

}

function openTable(TableName: string){

}

function buildNode(ns: NS, host: string, PositionData: Position): GraphNetworkNode{
    return {
        Name: host,
        GrowthRate: ns.getServer(host).serverGrowth,
        HackLvl: ns.getServer(host).requiredHackingSkill,
        Pwned: ns.getServer(host).hasAdminRights,

        Parent: PositionData.Parent,
        Depth: PositionData.Depth,
        Position: PositionData.Position,
        Children: []
    };
}

function orderedPush(ns: NS, Node: NetworkNode) {
    let OrderableNode: TableCell    = ['',0];
    OrderableNode[0] 	= Node.Name;
    OrderableNode[1]	= ns.getHackTime(Node.Name);

    let Position		= OrderByHackTime.length - 1;
    let PosAssigned		= false;

    // log(ns, 'term',`Current Order Node ${OrderableNode}`);
    while (!PosAssigned && Position != -1){
        // log(ns, 'term',`Ordering Node...`);
        // check if right side
        if (OrderableNode[1] > OrderByHackTime[Position][1]){
            // log(ns, 'term',`Pushing ${OrderableNode} to right...`);
            OrderByHackTime.push(OrderableNode);
            PosAssigned = true;
        }
        // Else check if left side
        else if ((Position != 0) && (OrderableNode[1] < OrderByHackTime[Position][1]) && (OrderableNode[1] > OrderByHackTime[Position-1][1])){
            // log(ns, 'term',`Pushing ${OrderableNode} to left...`);
            OrderByHackTime.splice(Position, 0, OrderableNode);
            PosAssigned = true;
        } else {
            // log(ns, 'term',`Not comparable. Moving up list...`);
            Position--;
        }
    }
}

//#region Eulrvisor Interface ===================================

/**
 *  Eulrvisor mode type-guard & definition
 * */

// Default config for empty call
const _DEFAULTFLAGS: SchemaObj      = {
    mode: 'list',
    export: true,
    out: 'vx_eulr.js',
}

const EulrRuntimeModeL = [
    'table',
    'graph',
    'list',
    'search',
    undefined
] as const;

export type EulrRuntimeMode = (typeof EulrRuntimeModeL)[number];
export function isEulrRuntimeMode(In: any): In is EulrRuntimeMode {
    return EulrRuntimeModeL.indexOf(In) !== -1;
}

type Schema = [string, (string | number | boolean | string[])][];
type SchemaObj = {[p: string]: string[] | ScriptArg};

// Config builder
export function BuildConfig(_FLAGS: SchemaObj = _DEFAULTFLAGS, log: string | undefined = '/log/L_Eulr.txt'): Eulrcfg {
    return {
        mode: isEulrRuntimeMode(_FLAGS.mode) ? _FLAGS.mode : undefined,
        log: log,
        export: (typeof _FLAGS.export == "boolean") ? _FLAGS.export : false,
        out: `${_FLAGS.out}`,
    }
}

// Eulrvisor Config interface
/**
 *  @property {EulrRuntimeMode} mode,
 *  @property {string | undefined} log
 *  @property {boolean} export
 *  @property {string} out
 * */
export interface Eulrcfg {
    mode: EulrRuntimeMode,
    log: string | undefined
    export: boolean
    out: string,
}

//#endregion