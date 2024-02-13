import type { Contribution } from "./Contribution";

import type * as d3 from "d3";

export interface D3Node extends d3.SimulationNodeDatum{
    id: number,
}

export interface D3Graph{
    nodes: D3Node[],
    links: {
        id: number,
        source: number,         // "parent"  // represents the index in the nodes array!!
        target: number,         // "child"   // "
        isFirstLink: boolean,
    }[], // note to self this notes an array of interface type (do not remove)
    contributions: Contribution[],
}
