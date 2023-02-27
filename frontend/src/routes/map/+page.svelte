<script lang="ts">
	import type { PageData } from "./$types";
    import * as d3 from "d3";
    import { forceSimulation } from 'd3';
	import { onMount } from "svelte";
	import type { Contribution } from "$lib/models/Contribution";
    import ContributionCard from "$lib/components/ContributionCard.svelte";

    export let data:PageData;

    let selectedContribution:Contribution;

    onMount(()=> {
        console.log("data", data);

        const svg = d3.select("svg");
        
        const circleRadius = 15;
        const width = innerWidth;
        const height = innerHeight;

        svg.append("svg:defs").append("svg:marker")
        .attr("id", "triangle")
        .attr("refX", circleRadius + 2) // must a bit bigger than circleRadius
        .attr("refY", 6) // must be markerWidth / 2
        .attr("markerUnits", "strokeWidth")
        .attr("markerWidth", 12)
        .attr("markerHeight", 12)
        .attr("viewBox", "0 0 12 12")
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
        .style("fill", "black");
        
        const link = svg
        .selectAll(".link")
        .data(data.graph.links)
        .join("line")
        .classed("link", true)
        .attr("stroke", (l) => l.isFirstLink ? "#333" : "#ccc")
        .style("stroke-width", "2px")
        .attr("marker-end","url(#triangle)");

        const node = svg
        .selectAll(".node")
        .data(data.graph.nodes)
        .join("g")
        // .attr("fx", (d:any) => {
        //     if (d.isGraine){
        //         d.fx = (width / 2) + (Math.random() * 400 - 200);
        //         d.fy = (height / 2) + (Math.random()) * 400 - 200;
        //     }
        // })
        .on("click", (e, d) => {
            selectedContribution = d as Contribution;
        });


        node.append("circle")
        .attr("r", circleRadius)
        .style("fill", (d:any) => d.color)
        .classed("node", true)
        .classed("fixed", (d:any) => d.fx !== undefined);

        node.append("text")
        .text((d:any) => d.title);


        const simulation = d3
        .forceSimulation()
        .nodes(data.graph.nodes)
        .force("charge", d3.forceManyBody().strength(-50))
        .force("collide", d3.forceCollide().radius((d) => circleRadius * 2))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("link", d3.forceLink(data.graph.links).distance(l => l.isFirstLink ? 60 : 200))
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

{#if selectedContribution}
    <ContributionCard contribution={selectedContribution} />
{/if}

<svg></svg>

<style>
    svg{
        width: 100%;
        height: 100%;
    }

</style>