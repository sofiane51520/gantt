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
            .attr("style", "max-width: 100%; height: auto; user-select:none;");

        svg.selectAll("*").remove();

        const axisGroup = svg.append("g")
            .attr("class", "axis")
            .call(axis);

        const referentialDateStartX = x(referentialDate)
        const referentialDateEndX = x(new Date(referentialDate.getTime() + 1000 * 60 * 60 * 8))

        svg.append("g")
            .append("rect")
            .attr("id", "referentialZone")
            .attr("fill", "red")
            .attr("z-index", "0")
            .attr("opacity", 0.1)
            .attr("x", referentialDateStartX)
            .attr("y", 0)
            .attr("height", height)
            .attr("width", referentialDateEndX - referentialDateStartX);

        svg.append("g")
            .append("line")
            .attr("id", "referentialLine")
            .attr("stroke", "red")
            .attr("x1", referentialDateStartX)
            .attr("x2", referentialDateStartX)
            .attr("y1", 0)
            .attr("y2", height);

        svg.append("g")
            .append("line")
            .attr("id", "referentialLineShadow")
            .attr("stroke", "red")
            .attr("y1", 0)
            .attr("y2", height);

        svg.on("mousemove", function (event) {
            const [mouseX] = d3.pointer(event);
            const xScale = d3.scaleUtc()
                .domain([startDate, endDate])
                .range([GANTT_CONFIG.labelWidth + GANTT_CONFIG.separation, width - 20]);

            const date = xScale.invert(mouseX);
            const alignedX = xScale(date);
            svg.select("#referentialLineShadow")
                .attr("x1", alignedX)
                .attr("x2", alignedX)
                .attr("opacity", 0.5);
        }).on("mouseleave", function () {
            svg.select("#referentialLineShadow").attr("opacity", 0);
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
            .attr("x", (task: GanttTask) => x(task.startDate))
            .attr("y", 0)
            .attr("height", rowHeight - 4)
            .attr("width", (task: GanttTask) => {
                const end = task.endDate ?? new Date(task.startDate.getTime() + 60 * 60 * 1000);
                return x(end) - x(task.startDate);
            })
            .attr("fill", rectangleColor);

        taskGroups.append("text")
            .attr("x", (task: GanttTask) => getLevel(task) * indentWidth + 5)
            .attr("y", rowHeight / 2)
            .attr("dominant-baseline", "middle")
            .attr("fill", textColor)
            .attr("font-size", textFontSize)
            .style("cursor", "pointer")
            .on("click", (_event, task: GanttTask) => task.onClick())
            .text((task: GanttTask) => task.name);

        // @ts-expect-error no problemo j'pige R
        const zoom = (svg: Selection<SVGSVGElement, GanttTask>): void => {
            const extent: [[number, number], [number, number]] = [[labelWidth + separation, 0], [width, height]];

            svg.call(d3.zoom()
                .scaleExtent([0.5, 12])
                .translateExtent(extent)
                .extent(extent)
                .on("zoom", zoomed));

        }

        const zoomed = (event: d3.D3ZoomEvent<SVGSVGElement, GanttTask>) => {
            const newX = event.transform.rescaleX(x);
            const k = event.transform.k;
            axisGroup.call(axis.scale(newX).ticks(tickNumber).tickFormat(getTickFormat(k)));

            svg.selectAll(".task rect")
                // @ts-expect-error rends pas fou
                .attr("x", (task: GanttTask) => newX(task.startDate))
                // @ts-expect-error rends pas fou
                .attr("width", (task: GanttTask) => {
                    const end = task.endDate ?? new Date(task.startDate.getTime() + 60 * 60 * 1000);
                    return newX(end) - newX(task.startDate);
                });

            const referentialDateStartX = newX(referentialDate)
            const referentialDateEndX = newX(new Date(referentialDate.getTime() + 1000 * 60 * 60 * 8))

            svg.select("#referentialZone")
                .attr("x", referentialDateStartX)
                .attr("y", 0)
                .attr("width", referentialDateEndX - referentialDateStartX)
                .attr("height", height);


            svg.select("#referentialLine")
                .attr("x1", referentialDateStartX)
                .attr("x2", referentialDateStartX)

            const [mouseX] = d3.pointer(event);
            // Fix value on drag and drop
            svg.select("#referentialLineShadow")
                .attr("x1", mouseX)
                .attr("x2", mouseX)

        }

        svg.call(zoom);

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
