<script lang="ts">
    import Slider from "$lib/components/Slider.svelte";
	import type { PageData } from "./$types";
    import * as d3 from "d3";
    import { forceSimulation } from 'd3';
	import { onMount } from "svelte";
	import type { Contribution } from "$lib/models/Contribution";
    import ContributionCard from "$lib/components/ContributionCard.svelte";
	// import { newDateOrNull } from "$lib/services/dateUtils";
	import { goto } from "$app/navigation";

    export let data:PageData;

    let selectedContribution:Contribution | null;

    let svg: any;
    let rootOfGraph: any; // first g element of svg (root of all nodes)
    let circle: any;

    const circleRadius = 15;
    let simulation:any;
    let charge = -50;
    let linkForce = 60;
    let collisionRadius = circleRadius * 2;

    $:{
        if (data.contribution && simulation){
            select(data.contribution);
        }
        
        if(!data.contribution && simulation){
            console.log("deselect");
            deselect();
        }
    }

    onMount(()=> {
        console.log("onmount");
        svg = d3.select("svg");
        rootOfGraph = svg.append("g");
        
        const width = innerWidth;
        const height = innerHeight;

        console.log("on mount", data);

        const makeArrow = (idName:string, color: string) => {
            return svg.append("svg:defs").append("svg:marker")
                .attr("id", idName)
                .attr("refX", circleRadius + 2) // must a bit bigger than circleRadius
                .attr("refY", 3) // must be markerWidth / 2
                .attr("markerUnits", "strokeWidth")
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("viewBox", "0 0 6 6")
                .attr("orient", "auto")
                .append("path")
                .attr("d", "M0,0 l3,3 l-3,3")
                .style("fill", color);
        }

        const linkColor = "#333";

        const arrowBlack = makeArrow("arrow-black", linkColor);

        const link = rootOfGraph
        .selectAll(".link")
        .data(data.graph.links)
        .join("line")
        .classed("link", true)
        .attr("stroke", (l) => linkColor)
        .style("stroke-width", "2px")
        .attr("marker-end",  "url(#arrow-black)");
        
        const drag = d3
        .drag()
        .on("start", dragstart)
        .on("drag", dragged);

        const node = rootOfGraph
        .selectAll(".node")
        .data(data.graph.nodes)
        .join("g")
        // .attr("fx", (d:any) => {
        //     if (d.isGraine){
        //         d.fx = (width / 2) + (Math.random() * 400 - 200);
        //         d.fy = (height / 2) + (Math.random()) * 400 - 200;
        //     }
        // })
        .attr("id", function (d) { 
            // add contribution id to each node
            return `contribution_id_${d.id}`; 
        })
        .call(drag as any)
        .on("click", function(e, d) {
            e.stopPropagation();

            const selectedContributionId = (d as Contribution).id;
            goto(`/map/${selectedContributionId}`);

            // // remove fixed status set during drag
            // delete d.fx;
            // delete d.fy;

            // selectedContribution = d as Contribution;

            // // clear all state
            // data.graph.nodes.forEach((node:any) => delete(node.d3SelectAsParentOrChild));

            // const parents = selectedContribution.parents.map(parentId => {
            //     return data.graph.nodes.find(n => n.id == parentId);
            // });
            // parents.forEach((contrib:any) => contrib.d3SelectAsParentOrChild = true);
            
            // const children = selectedContribution.children.map(childId => {
            //     return data.graph.nodes.find(n => n.id == childId);
            // });
            // children.forEach((contrib:any) => contrib.d3SelectAsParentOrChild = true);

            // // change visual style of selected node
            // svg.selectAll('.selected').classed('selected', false);
            // d3.select(this).classed('selected', true);

            // const greyedOutColor = "#eee";
            // circle.style("fill", (d:any) => {
            //     // alway preserve color of graine
            //     if(d.isGraine){
            //         return d.color;
            //     }
            //     return d.d3SelectAsParentOrChild ? d.color : greyedOutColor;
            // });
        });


        circle = node.append("circle")
        .attr("r", circleRadius)
        .style("fill", (d:any) => d.color)
        .classed("node", true)
        .classed("fixed", (d:any) => d.fx !== undefined);

        // adds perAuthorTextIndex in center of nodes
        node.append("text")
        .text((d:any) => d.perAuthorTextIndex)
        .attr("text-anchor", "middle")
        .attr("y", 5)
        .attr("alignment-baseline", "central");


        function dragstart() {
            d3.select(this).classed("fixed", true);
        }

        function clamp(x:number, lo: number, hi:number) {
            return x < lo ? lo : x > hi ? hi : x;
        }

        function dragged(event:any, d:any) {
            d.fx = clamp(event.x, 0, width);
            d.fy = clamp(event.y, 0, height);
            simulation.alpha(1).restart();
        }



        simulation = d3
        .forceSimulation()
        .nodes(data.graph.nodes)
        .force("charge", d3.forceManyBody().strength(charge))
        .force("collide", d3.forceCollide().radius((d) => collisionRadius))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("link", d3.forceLink(data.graph.links).distance(l => l.isFirstLink ? linkForce : linkForce * 3))
        .on("tick", tick);

        const zoom = d3.zoom().on('zoom', handleZoomAndPan);

        svg.call(zoom);

        function handleZoomAndPan(e: any){
            // console.log("zoom and pan", e.transform);
            rootOfGraph.attr('transform', e.transform);
        }

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

        // check if we have a selected Contribution coming from the url
        if(data.contribution){
            select(data.contribution);
        }
    });

    function select(contribution: Contribution){

        selectedContribution = contribution;

        // clear all state
        data.graph.nodes.forEach((node:any) => delete(node.d3SelectAsParentOrChild));
        

        const parents = selectedContribution.parents.map(parentId => {
            return data.graph.nodes.find(n => n.id == parentId);
        });
        parents.forEach((contrib:any) => contrib.d3SelectAsParentOrChild = true);
        
        const children = selectedContribution.children.map(childId => {
            return data.graph.nodes.find(n => n.id == childId);
        });
        children.forEach((contrib:any) => contrib.d3SelectAsParentOrChild = true);

        // change visual style of selected node
        svg.selectAll('.selected').classed('selected', false);
        // d3.select(this).classed('selected', true);
        const selectedVisualElement = d3.select(`#contribution_id_${selectedContribution.id}`)
        selectedVisualElement.classed('selected', true);
        // remove fixed status set during drag
        delete (selectedVisualElement as any).fx;
        delete (selectedVisualElement as any).fy;

        const greyedOutColor = "#eee";
        circle.style("fill", (d:any) => {
            // alway preserve color of graine
            if(d.isGraine){
                return d.color;
            }
            return d.d3SelectAsParentOrChild ? d.color : greyedOutColor;
        });
    }

    function deselect(){
        if (selectedContribution){
            const selectedVisualElement = d3.select(`#contribution_id_${selectedContribution.id}`)
            selectedVisualElement.classed('selected', false);
        }
        
        selectedContribution = null;

        console.log("deselect", circle);
        circle.style("fill", (d:any) => d.color);
    }

    function updateSimulation(){
        console.log("update simulation------------")
        console.log("charge", charge);
        console.log("linkForce", linkForce);
        console.log("collisionRadius", collisionRadius);

        simulation
        .force("charge", d3.forceManyBody().strength(charge))
        .force("collide", d3.forceCollide().radius((d) => collisionRadius))
        .force("link", d3.forceLink(data.graph.links).distance(l => l.isFirstLink ? linkForce : linkForce * 3))
        .alpha(1) // reheats sim (goes from 1 to 0)
        .restart();
    }
</script>

<svelte:body on:click={ deselect }/>

<h1>Map</h1>

{#if selectedContribution}
    <ContributionCard 
        contribution={selectedContribution} 
        on:cardSelectionRequest={() => goto(`/contribution/${selectedContribution?.id}`) } 
    />
{/if}

<div class="controls">
    -- repulsion attraction --
    <Slider min={-70} value={charge} max={70} on:input={ (e) => { charge = e.detail.value; updateSimulation()} } />
    link force (link magnitude)
    <Slider min={0} value={linkForce} max={150} on:input={ (e) => { linkForce = e.detail.value; updateSimulation()} } />
    collision radius (node vs node)
    <Slider min={10} value={30} max={60} on:input={ (e) => { collisionRadius = e.detail.value; updateSimulation()} } />
</div>

<svg></svg>

<style>
    svg{
        width: 100%;
        height: 100%;
    }
    .controls{
        position: fixed;
        width: 200px;
        height: 200px;
        bottom:20px;
        left: 20px;
        background-color: rgba(0, 0, 0, 0.1);
    }
</style>