import {useEffect, useRef} from "react";
import {GANTT_CONFIG, type GanttProps, type GanttTask} from "./gantt.ts";
import * as d3 from "d3";
import type {NumberValue} from "d3";

const getLevel = (task: GanttTask) => task.path.split("/").length - 1;

export function GanttChart({tasks, width, height, startDate, endDate, referentialDate}: GanttProps) {
    const svgRef = useRef<SVGSVGElement | null>(null);
    //TODO FIX RESET ZOOM ON TOGGLE
    useEffect(() => {
        console.log("useEffect")
        if (!tasks || tasks.length === 0) return;

        const {
            marginTop,
            rowHeight,
            indentWidth,
            labelWidth,
            separation,
            rectangleColor,
            axisStroke,
            axisStrokeWidth,
            textFontSize,
            textColor,
            tickNumber,
            hoverStroke,
            hoverFill
        } = GANTT_CONFIG;

        const sortedTasks = [...tasks].sort((a, b) => a.path.localeCompare(b.path));

        const x = d3.scaleUtc()
            .domain([startDate, endDate])
            .range([labelWidth + separation, width - 20]);

        const axis = d3.axisTop(x).ticks(tickNumber);

        const svg = d3.select(svgRef.current)
            .attr("viewBox", [0, -marginTop, width, height])
            .attr("width", width)
            .attr("height", height)
            .attr("style", "max-width: 100%; height: auto;");

        svg.selectAll("*").remove();

        const axisGroup = svg.append("g")
            .attr("class", "axis")
            .call(axis);

        const referentialDateStartX = x(referentialDate)
        const referentialDateEndX = x(new Date(referentialDate.getTime() + 1000 * 60 * 60 * 8))

        svg.append("g")
            .attr("id", "referentialZone")
            .append("rect")
            .attr("fill", "red")
            .attr("z-index", "0")
            .attr("opacity", 0.1)
            .attr("x", referentialDateStartX)
            .attr("y", 0)
            .attr("height", height)
            .attr("width", referentialDateEndX - referentialDateStartX);


        svg.on("mousemove", function (event) {
            const [mouseX] = d3.pointer(event);
            const transform = d3.zoomTransform(svg.node());
            const newX = transform.invertX(mouseX);
            const newXX = transform.applyX(newX)
            const date = x.invert(newX);

            svg.selectAll("#referentialLineShadow line, #referentialLineShadow text")
                .attr("x1", newXX)
                .attr("x2", newXX)
                .attr("x", newXX)
                .text(d3.utcFormat("%m-%d-%H-%M")(date))
                .attr("opacity", 0.5);
        }).on("mouseleave", function () {
            svg.selectAll("#referentialLineShadow line, #referentialLineShadow text").attr("opacity", 0);
        });

        const taskGroups = svg.append("g")
            .attr("class", "tasks")
            .selectAll(".task")
            .data(sortedTasks)
            .join("g")
            .attr("class", "task")
            .attr("transform", (_task: GanttTask, index: number) => `translate(5, ${index * rowHeight + 5})`)
            .on("mouseover", function () {
                d3.select(this).select("rect")
                    .attr("fill", hoverFill)
                    .attr("stroke", hoverStroke)
                    .attr("stroke-width", 1);
                d3.select(this).select("text")
                    .attr("fill", hoverStroke)
                    .attr("font-weight", "bold");
            })
            .on("mouseout", function () {
                d3.select(this).select("rect")
                    .attr("fill", rectangleColor)
                    .attr("stroke", "none");
                d3.select(this).select("text")
                    .attr("fill", textColor)
                    .attr("font-weight", "normal");
            });

        svg.append("line")
            .attr("x1", labelWidth - 20)
            .attr("y1", -20)
            .attr("x2", labelWidth - 20)
            .attr("y2", height)
            .attr("stroke", axisStroke)
            .attr("stroke-width", axisStrokeWidth);

        taskGroups.append("rect")
            .attr("x", (task: GanttTask) => Math.max(labelWidth + separation, x(task.startDate)))
            .attr("y", 0)
            .attr("height", rowHeight - 4)
            .attr("width", (task: GanttTask) => {
                const end = task.endDate ?? new Date(task.startDate.getTime() + 60 * 60 * 1000);
                return x(end) - x(task.startDate);
            })
            .attr("fill", rectangleColor);

        svg.append("g")
            .attr("id", "referentialLine")
            .append("line")
            .attr("stroke", "red")
            .attr("x1", referentialDateStartX)
            .attr("x2", referentialDateStartX)
            .attr("y1", 0)
            .attr("y2", height)
            .attr("z-index",10);
        svg.select("#referentialLine")
            .append("text")
            .datum(referentialDate.getTime())
            .attr("y", 0)
            .attr("x", referentialDateStartX)
            .attr("fill", "white")
            .attr("font", "bold 6px")
            .text(d3.utcFormat("%m-%d-%H-%M")(x.invert(referentialDateStartX)))

        svg.append("g")
            .attr("id", "referentialLineShadow")
            .append("line")
            .attr("stroke", "red")
            .attr("y1", 0)
            .attr("y2", height)
            .attr("opacity", 0)
            .attr("z-index",10);
        svg.select("#referentialLineShadow")
            .append("text")
            .attr("y", 0)
            .attr("x", referentialDateStartX)
            .attr("fill", "white")
            .attr("font", "bold 6px")
            .text(d3.utcFormat("%m-%d-%H-%M")(x.invert(referentialDateStartX)))

        taskGroups.append("text")
            .attr("x", (task: GanttTask) => getLevel(task) * indentWidth + 5)
            .attr("y", rowHeight / 2)
            .attr("dominant-baseline", "middle")
            .attr("fill", textColor)
            .attr("font-size", textFontSize)
            .style("cursor", "pointer")
            .on("click", (_event, task: GanttTask) => task.onClick())
            .text((task: GanttTask) => task.name);


        svg.on("click", (event) => {
            const transform = d3.zoomTransform(svg.node());
            const [pointX] = d3.pointer(event);
            const newX = transform.invertX(pointX);
            const newXX = transform.applyX(newX)
            const date = x.invert(newX);

            svg.select("#referentialLine line")
                .attr("x1", newXX)
                .attr("x2", newXX);
            svg.select("#referentialLine text")
                .attr("x", newXX)
                .datum([new Date(date).getTime()])
                .text(d3.utcFormat("%m-%d-%H-%M")(date));
        });
        svg.on("dblclick",null);

        const zoomed = (event: d3.D3ZoomEvent<SVGSVGElement, GanttTask>) => {
            const newX = event.transform.rescaleX(x);
            const k = event.transform.k;
            axisGroup.call(axis.scale(newX).ticks(tickNumber).tickFormat(getTickFormat(k)));

            svg.selectAll(".task rect").attr("transform", `translate(${event.transform.x}, 0) scale(${event.transform.k}, 1)`)
            svg.select("#referentialZone rect").attr("transform", `translate(${event.transform.x}, 0) scale(${event.transform.k}, 1)`)

            const currentDate :number= svg.select("#referentialLine text").datum()
            svg.select("#referentialLine line").attr("x1" ,newX(currentDate)).attr("x2",newX(currentDate))
            svg.select("#referentialLine text").attr("x" ,newX(currentDate))

            svg.select("#referentialLineShadow line")
                .attr("opacity", 0)
        }

        const zoomEnd = () => {
            svg.select("#referentialLineShadow line").attr("opacity", 0.5)
        }
        const extent: [[number, number], [number, number]] = [[labelWidth + separation, 0], [width, height]];

        // @ts-expect-error no problemo j'pige R
        svg.call(d3.zoom()
            .scaleExtent([0.5, 16])
            .translateExtent(extent)
            // .extent(extent)
            .on("zoom", zoomed).on("end", zoomEnd));

    }, [tasks, width, height, startDate, endDate, referentialDate]);

    return <svg ref={svgRef} id="ganttChart"/>;
}

const getTickFormat = (zoomLevel: number): (domainValue: Date | NumberValue, index: number) => string => {
    let tickFormat;
    if (zoomLevel < 2) {
        tickFormat = d3.utcFormat("%d %b");
    } else if (zoomLevel < 4) {
        tickFormat = d3.utcFormat("%H:%M");
    } else {
        tickFormat = (d: Date) => {
            if (d.getUTCHours() === 0 && d.getUTCMinutes() === 0) {
                return d3.utcFormat("%d %b")(d);
            }
            return d3.utcFormat("%H:%M")(d);
        };
    }
    // @ts-expect-error rends pas fou
    return tickFormat;
}
