<script lang="ts">
	import type { PageData } from "./$types";
    import * as d3 from "d3";
    import { forceSimulation } from 'd3';
	import { onMount } from "svelte";

    export let data:PageData;

    onMount(()=> {
        console.log("data", data);

        const svg = d3.select("svg");
        const link = svg
        .selectAll(".link")
        .data(data.graph.links)
        .join("line")
        .classed("link", true);

        const node = svg
        .selectAll(".node")
        .data(data.graph.nodes)
        .join("g");

        const circleRadius = 18;

        node.append("circle")
        .attr("r", circleRadius)
        .classed("node", true)
        .classed("fixed", (d:any) => d.fx !== undefined);

        node.append("text")
        .text((d:any) => d.title);

        const width = innerWidth;
        const height = innerHeight;

        const simulation = d3
        .forceSimulation()
        .nodes(data.graph.nodes)
        .force("charge", d3.forceManyBody().strength(-20))
        .force("collide", d3.forceCollide().radius((d) => circleRadius * 2))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("link", d3.forceLink(data.graph.links).distance(160))
        .on("tick", tick);

        function tick() {
            link
                .attr("x1", (d:any) => d.source.x)
                .attr("y1", (d:any) => d.source.y)
                .attr("x2", (d:any) => d.target.x)
                .attr("y2", (d:any) => d.target.y);
            // node
            //     .attr("cx", d => d.x)
            //     .attr("cy", d => d.y);
            node.attr("transform", (d:any) => `translate(${d.x}, ${d.y})`);
        }
    });
    
</script>


<h1>Map</h1>

<svg></svg>

<style>
    svg{
        width: 100%;
        height: 100%;
    }

</style>