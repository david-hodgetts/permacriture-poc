<script lang="ts">
    import * as d3 from "d3";
    import { forceSimulation } from 'd3';
	import { onMount, createEventDispatcher } from "svelte";
	import { ContributionState, type Contribution } from "$lib/models/Contribution";
	import type { D3Graph } from "$lib/models/D3Graph";
	import type Author from "$lib/models/Author";

    const dispatch = createEventDispatcher();

    export let data:{
        graph: D3Graph,
        authors: Author[],
        contribution: Contribution | null;
    };

    export let separation: number = 20; 

    export let allowMouseOver = false;
    
    const rectSize = 54;
    let charge = 0;
    let linkForce = 100;
    let collisionRadius = rectSize;
    let mapReady = false;

    let element:HTMLElement; // root div
    let preSelectedContribution:Contribution | null = null;
    let activeContribution:Contribution | null = null;

    $: defaultSelectedContribution = data.contribution; // 

    let i = 0;

    $: {
        if(mapReady && defaultSelectedContribution){
            select(defaultSelectedContribution);

            // ensure defaultSelectedContribution is fixed
            if(node && i == 1){
                node.attr("fx", (d:any) => {
                    delete d.fx;
                    delete d.fx;

                    // ensure we fix defaultSelectedContribution
                    // if(defaultSelectedContribution?.badgeText == d.badgeText){
                    //     d.fx = width / 2; 
                    //     d.fy = height / 2;
                    //     console.log(`fixing ${d.badgeText} at fx ${d.fx} fy ${d.fy}`);
                    // }else{
                    //     delete d.fx;
                    //     delete d.fx;
                    // }
                });
            }
            i++;
        }
    }


    let svg: any;
    let rootOfGraph: any; // first g element of svg (root of all nodes)
    let node: any;
    let rect: any;

    let simulation:any;

    let width:number;
    let height:number;

    $:{
        charge = 150; // (separation * 1 - 50);
        linkForce = separation * 3;
        if(simulation){
            updateSimulation();
        }
    }

    onMount(()=> {
        svg = d3.select("#maproot")
            .append("svg")
            .attr("class", "mapSvg");

        rootOfGraph = svg.append("g");
        
        const bbox = element.getBoundingClientRect();
        width = bbox.width;
        height = bbox.height;
        addEventListener('resize', onResize);

        defaultSelectedContribution = data.contribution;

        // console.log("on mount", data.graph.links, data.graph.nodes);
        // console.log(`width ${width} - height ${height}`);

        const makeArrow = (idName: string, color: string) => {
            return svg.append("svg:defs").append("svg:marker")
                .attr("id", idName)
                .attr("refX", (rectSize / 2) + 2) // must a bit bigger than rectWidth
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

        const linkColor = "#fff";
        const arrowBlack = makeArrow("arrow-black", linkColor);

        const link = rootOfGraph
        .selectAll(".link")
        .data(data.graph.links)
        .join("line")
        .classed("link", true)
        .classed("editing-link", function (d:any){
            return d.linksToContributionInEditingState;
        })
        .attr("stroke", (l) => linkColor)
        .style("stroke-width", "3px");
        // .attr("marker-end",  "url(#arrow-black)");
        
        const drag = d3
        .drag()
        .on("start", dragstart)
        .on("drag", dragged);

        node = rootOfGraph
        .selectAll(".node")
        .data(data.graph.nodes)
        .join("g")
        .classed("unselectable", (d) => d.isBeingEditedBySomeoneElse)
        .attr("fx", (d:any) => {
            if(defaultSelectedContribution && d.badgeText == defaultSelectedContribution.badgeText){
                d.fx = width / 2;
                d.fy = height / 2;
            }
        })
        .attr("id", function (d) { 
            // add contribution id to each node
            return `contribution_id_${d.id}`; 
        })
        .call(drag as any)
        .on("click", function(e, d) {

            e.stopPropagation();

            const clickedContributionId = (d as Contribution).id;

            if(preSelectedContribution && clickedContributionId == preSelectedContribution.id){
                const selectedContributionId = (d as Contribution).id;
                dispatch("contributionSelection", {id: selectedContributionId});
                return;
            }

            select(d);

            // remove fixed status set during drag
            delete d.fx;
            delete d.fy;

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
        })
        .on("mouseover", function(e, d){
            if(!allowMouseOver) return;
            mouseOverAction(e, d);
        })
        .on("mouseout", function(e, d){
            if(!allowMouseOver) return;
            mouseOutAction(e, d);
        });

        function mouseOverAction(e, d){
            const isHover = true;
            makeActive(d);
        }

        function mouseOutAction(e, d){
            unMakeActive(d);
        }

        rect = node.append("rect")
        .attr("x", -rectSize / 2)
        .attr("y", -rectSize / 2)
        .attr("width", rectSize)
        .attr("height", rectSize)
        .attr("rx", 10)
        .attr("ry", 10)
        .style("fill", (d:any) => d.color)
        .style("stroke", "none")
        .classed("node", true)
        .classed("fixed", (d:any) => d.fx !== undefined);

        // adds perAuthorTextIndex in center of nodes
        node.append("text")
        .text((d:any) => d.badgeText) // don't show graine authorTextIndex   
        .attr("text-anchor", "middle")
        .attr("y", 5)
        .attr("alignment-baseline", "central")
        .attr("class", "no-select")
        .attr("font-weight", 700)
        .attr("fill", "white");


        function dragstart() {
            d3.select(this).classed("fixed", true);
        }

        function clamp(x:number, lo: number, hi:number) {
            return x < lo ? lo : x > hi ? hi : x;
        }

        /**
         * extracts translation and scale from element attribute
         * @param transformAttr
         */
        function extractTransform(transformAttr:string|null): {translation:{x:number, y: number}, scale: number}{
            if(!transformAttr){
                return{
                    scale:1,
                    translation:{
                        x:0,
                        y:0,
                    }
                } 
            }
            
            const floatRe = "([+-]?[0-9]*[.]?[0-9]+)";
            const scaleRe = new RegExp(`scale\\(${floatRe}\\)`);
            const scale = parseFloat(transformAttr.match(scaleRe)![1]);

            const translateReStr = `translate\\(${floatRe}\\s*,\\s*${floatRe}\\)`;
            const translateRe = new RegExp(translateReStr);
            const translateMatch = transformAttr.match(translateRe);
            const translation = {
                x: parseFloat(translateMatch![1]),
                y: parseFloat(translateMatch![2]),
            }

            return {
                scale,
                translation,
            };
        }

        function dragged(event:any, d:any) {
            const transform = extractTransform(rootOfGraph.attr('transform'));

            const w = width * (1 / transform.scale);
            const maxX = w - (transform.translation.x *  (1 / transform.scale));
            const minX = -(transform.translation.x *  (1 / transform.scale));
            
            const h = height * (1 / transform.scale);
            const maxY = h - (transform.translation.y * (1 / transform.scale));
            const minY = -(transform.translation.y * (1 / transform.scale));
            // console.log(`x ${event.x}  transform.translation.x ${transform.translation.x} w ${w} maxX ${maxX} minX ${minX}`);
            d.fx = clamp(event.x, minX, maxX);
            d.fy = clamp(event.y, minY, maxY);
            simulation.alpha(1).restart();
        }

        simulation = d3
        .forceSimulation()
        .nodes(data.graph.nodes)
        .force("charge", d3.forceManyBody().strength(charge))
        .force("collide", d3.forceCollide().radius((d) => collisionRadius))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("link", d3.forceLink(data.graph.links).distance(l => linkForce))
        .on("tick", tick);

        const zoom = d3.zoom().on('zoom', handleZoomAndPan);

        svg.call(zoom)
        .on("dblclick.zoom", null); // disable zoom event on double click / double tap

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
            node.attr("transform", (d:any) => `translate(${d.x}, ${d.y})`);
        }

        // check if we have a selected Contribution coming from the url
        if(data.contribution){
            select(data.contribution);
        }

        mapReady = true;
    });

    function onResize(){
        if(element){
            const bbox = element.getBoundingClientRect();
            width = bbox.width;
            height = bbox.height;
        }
    }

    function select(contribution: Contribution ){
        preSelectedContribution = contribution;
        
        d3.selectAll(".link")
        .classed('greyed-link', function(d:any){
            // changed all links not connected to selected contribution
            return d.source.id != preSelectedContribution!.id && d.target.id != preSelectedContribution!.id;
        });

        const selectedVisualElement = d3.select(`#contribution_id_${preSelectedContribution.id}`)
        // selectedVisualElement.classed('selected', true);
        // remove fixed status set during drag
        delete (selectedVisualElement as any).fx;
        delete (selectedVisualElement as any).fy;

        const greyedOutColor = "#9B9B9B";
        rect.style("fill", (d:any) => {
            return d.id == preSelectedContribution!.id ? d.color : greyedOutColor;
        });
    }

    function unselect(){

        if (preSelectedContribution){
            const selectedVisualElement = d3.select(`#contribution_id_${preSelectedContribution.id}`)
            selectedVisualElement.classed('selected', false);
        }
        
        preSelectedContribution = null;

        // console.log("unselect", rect);
        rect.style("fill", (d:any) => d.color);

        d3.selectAll(".link")
        .classed('greyed-link', false);

        dispatch("contributionUnSelected", {})

        if(defaultSelectedContribution){
            preSelectedContribution = defaultSelectedContribution;
            select(preSelectedContribution);
        }
    }

    function makeActive(contribution: Contribution ){
        activeContribution = contribution;
        
        d3.selectAll(".link")
        .classed('greyed-link', function(d:any){
            // changed all links not connected to selected contribution
            return d.source.id != activeContribution!.id && 
            d.target.id != activeContribution!.id; 
        })

        const selectedVisualElement = d3.select(`#contribution_id_${activeContribution.id}`)
        // selectedVisualElement.classed('selected', true);
        // remove fixed status set during drag
        delete (selectedVisualElement as any).fx;
        delete (selectedVisualElement as any).fy;

        const greyedOutColor = "#9B9B9B";
        rect.style("fill", (d:any) => {
            return (d.id == activeContribution!.id || d.isBeingEditedBySomeoneElse) ? d.color : greyedOutColor;
        });
    }

    function unMakeActive(){
        if(activeContribution){
            const selectedVisualElement = d3.select(`#contribution_id_${activeContribution.id}`)
            selectedVisualElement.classed('selected', false);
        }
        
        if (preSelectedContribution){
            select(preSelectedContribution);
        }else if(defaultSelectedContribution){
            preSelectedContribution = defaultSelectedContribution;
            select(preSelectedContribution);
        }else{
            // console.log("unselect", rect);
            rect.style("fill", (d:any) => d.color);

            d3.selectAll(".link")
            .classed('greyed-link', false);
        }

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

<!-- <svelte:body on:click={ deselect }/> -->


<div id="maproot" bind:this={element} on:click={unselect} on:keydown={()=>null} role="button" tabindex="0"></div>

<style>
    #maproot{
        width: 100%;
        height: 100%;
    }
    :global(.mapSvg){
        width: 100%;
        height: 100%;
    }
</style>