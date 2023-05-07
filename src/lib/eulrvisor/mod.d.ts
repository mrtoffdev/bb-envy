
export type TableCell = [string, number];

// not to be mixed with NSServer, which is a Server object directly referenced from the NS instance
export interface NetworkStack {
    ServerNames : string[],
    Tables      : simpletable,
    Root        : GraphNetworkNode | undefined;
}

type simpletable = [[table: string],[[key: string], undefined]];

export interface Server {

}

export interface NetworkNode {
    Name        : string,
    GrowthRate  : number,
    HackLvl     : number,
    Pwned       : boolean,
}

export interface GraphNetworkNode extends NetworkNode, Position {
    // Children: {[k: string]: any}
    Children    ?: NetworkList
}

export interface Position {
    Parent      : string,
    Depth       : number,
    Position    : number[],
}

export type NetworkList = GraphNetworkNode[];