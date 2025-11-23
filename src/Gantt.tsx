import {useEffect, useRef} from "react";
import {GANTT_CONFIG, type GanttProps, type GanttTask, type Task} from "./gantt.ts";
import * as d3 from "d3";
import {type NumberValue, zoomIdentity} from "d3";

const getLevel = (task: GanttTask) => task.path.split("/").length - 1;

export function GanttChart({tasks, width, height, startDate, endDate, referentialDate}: GanttProps) {
    // @ts-expect-error gfdg
    const svgRef = useRef<SVGSVSGElement>();
    // @ts-expect-error gfdg
    const xRef = useRef<d3.ScaleTime<number, number, never>>();
    //TODO FIX RESET ZOOM ON TOGGLE

    useEffect(() => {
        if (!tasks || tasks.length === 0) return;
        const {labelWidth, separation} = GANTT_CONFIG;

        const svg: d3.Selection<SVGSVGElement, unknown, null, undefined> = initSvg(svgRef.current, width, height, 45)
        const {
            Xaxis,
            axis2,
            x,
            XaxisGroup,
            axis2Group
        } = initAxes(xRef,svg, tasks, height, [referentialDate, new Date(referentialDate.getTime() + new Date(0).setHours(8))], [labelWidth + separation, width - 20])
        xRef.current = x;
        displayData(svg, tasks, x)
        initReferentialObjects(svg, referentialDate, xRef, height)
        initZoom(xRef, svg, Xaxis, XaxisGroup, axis2, axis2Group, x, width, referentialDate, tasks);
    }, []);

    useEffect(() => {
        if (svgRef.current) {
            const svg = d3.select(svgRef.current)
            displayData(svg, tasks, xRef.current)
        }
    }, [tasks]);
    return <svg ref={svgRef}/>;
}

const initSvg = (svgRef: SVGSVGElement, width: number, height: number, marginTop: number): d3.Selection<SVGSVGElement, unknown, null, undefined> => {
    const svg = d3.select(svgRef)
        .attr("viewBox", [0, -marginTop, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%;")

    svg.selectAll("*").remove();
    return svg;
}

const initAxes = (xRef: React.RefObject<d3.ScaleTime<number, number, never>>,svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, tasks: Task[], height: number, domain: [Date, Date], range: [number, number]) => {
    const {
        tickNumber,
    } = GANTT_CONFIG;

    const x: d3.ScaleTime<number, number, never> = d3.scaleUtc()
        .domain(domain)
        .range(range).clamp(false);
    const x2: d3.ScaleTime<number, number, never> = d3.scaleUtc()
        .domain(domain)
        .range(range);

    const Xaxis: d3.Axis<Date | NumberValue> = d3.axisTop(x).ticks(tickNumber, d3.utcFormat("%H:%M")).tickSizeInner(-height);
    const axis2: d3.Axis<Date | NumberValue> = d3.axisTop(x2).ticks(d3.utcDay.every(1), d3.utcFormat("%d %b"))
    const XaxisGroup: d3.Selection<SVGGElement, unknown, null, undefined> = svg.append("g")
        .attr("class", "Xaxis")
        .call(Xaxis).raise()

    const axis2Group = svg.append("g")
        .attr("class", "axis2")
        .attr("transform", `translate(0,${-25})`)
        .call(axis2).raise()
    xRef.current = x
    d3.selectAll("g .tick line").style("opacity", 0.1);

    return {Xaxis, axis2, x, XaxisGroup, axis2Group};
};

const displayData = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, data: GanttTask[], x: d3.ScaleTime<number, number, never>) => {

    const {
        rowHeight,
        indentWidth,
        labelWidth,
        separation,
        rectangleColor,
        textFontSize,
        textColor,
        hoverStroke,
        hoverFill
    } = GANTT_CONFIG;

    svg.selectAll(".tasks").remove();
    const taskGroups = svg.append("g")
        .attr("class", "tasks")
        .selectAll(".task")
        .data(data)
        .join("g")
        .attr("class", "task")
        // .attr("transform", (_task: GanttTask, index: number) => `translate(5, ${index * rowHeight + 5})`)
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
    const formatFull = d3.timeFormat("%d %b, %H:%M");
    taskGroups.append("rect")
        .attr("x", (task: GanttTask) => Math.max(labelWidth + separation, x(task.startDate)))
        .attr("y", (_task: GanttTask, index: number) => index * rowHeight + 5)
        .attr("height", rowHeight - 4)
        .attr("width", (task: GanttTask) => {
            const end = task.endDate ?? new Date(task.startDate.getTime() + 60 * 60 * 1000);
            return x(end) - x(task.startDate);
        })
        .attr("fill", rectangleColor)
        .append('title').text((task: GanttTask) => `${task.name} \n${formatFull(task.startDate)} ${task?.endDate !== undefined ? "| " + formatFull(task.endDate) : ""}`);

    taskGroups.append("text")
        .attr("x", (task: GanttTask) => getLevel(task) * indentWidth + 5)
        .attr("y", (_task: GanttTask, index: number) => index * rowHeight + 5)
        .attr("dominant-baseline", "middle")
        .attr("fill", textColor)
        .attr("font-size", textFontSize)
        .style("cursor", "pointer")
        .on("click", (_event, task: GanttTask) => task.onClick())
        .text((task: GanttTask) => task.name);
}

const initZoom = (xRef: React.RefObject<d3.ScaleTime<number, number, never>>, svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, Xaxis: d3.Axis<Date | NumberValue>, XaxisGroup: d3.Selection<SVGGElement, unknown, null, undefined>, axis2: d3.Axis<Date | NumberValue>, axis2Group: d3.Selection<SVGGElement, unknown, null, undefined>, x: d3.ScaleTime<number, number, never>, width: number, referentialDate:Date, tasks:Task[]) => {
    const {
        labelWidth,
        separation,
        marginTop
    } = GANTT_CONFIG;

    const zoomed = (event: d3.D3ZoomEvent<SVGSVGElement, GanttTask>) => {
        const newX = event.transform.rescaleX(x);
        XaxisGroup.call(Xaxis.scale(newX)).raise();
        axis2Group.call(axis2.scale(newX)).raise();

        xRef.current = newX;
        const currentDate = svg.select("#referentialLine text").datum() as number

        svg.selectAll(".task rect").attr("transform", `translate(${event.transform.x}, 1) scale(${event.transform.k}, 1)`)
        svg.select("#referentialZone rect").attr("x", newX(referentialDate.getTime()))
        svg.select("#referentialLine line").attr("x1", newX(currentDate)).attr("x2", newX(currentDate))
        d3.selectAll("g .tick line").style("opacity", 0.1);

    }

    const zoomEnd = () => {
        svg.select("#referentialLineShadow line").attr("opacity", 0.5)
    }

    const dragged = (event: d3.D3DragEvent<SVGSVGElement, GanttTask, { x: number, y: number }>) => {
        const {
            tickNumber,
        } = GANTT_CONFIG;

        const domainRange = xRef.current.domain()[1].getTime() - xRef.current.domain()[0].getTime();
        const zoomRatio = 1
        const pixelRange = xRef.current.range()[1] - xRef.current.range()[0];
        const pixelTimeRatio = (domainRange / pixelRange) * zoomRatio
        const timeShift = pixelTimeRatio * -event.dx

        const newX = xRef.current.copy().domain([new Date(xRef.current.domain()[0].getTime() + timeShift), new Date(xRef.current.domain()[1].getTime() + timeShift)]).clamp(false);
        XaxisGroup.call(d3.axisTop(newX).ticks(tickNumber, d3.utcFormat("%H:%M")).tickSizeInner(-1000));
        axis2Group.call(axis2.scale(newX));
        xRef.current = newX;

        displayData(svg, tasks, xRef.current);
        const currentDate = svg.select("#referentialLine text").datum() as number
        console.log(referentialDate, newX(referentialDate.getTime()))
        svg.select("#referentialLine line").attr("x1", newX(currentDate)).attr("x2", newX(currentDate))
        svg.select("#referentialLine text").attr("x", newX(currentDate))
        svg.select("#referentialZone rect").attr("x", newX(referentialDate.getTime()))

        svg.select("#referentialLineShadow line").attr("opacity", 0)
        svg.select("#referentialLineShadow text").attr("opacity", 0)
        d3.selectAll("g .tick line").style("opacity", 0.1);

    }

    const extent: [[number, number], [number, number]] = [[labelWidth + separation, marginTop], [width, 1200]];
    svg.call(
        // @ts-expect-error dsqd dsq
        d3.drag()
            .subject((event) => ({...event})).on("drag", dragged)
    );

    svg.call(
        // @ts-expect-error dsqd dsq
        d3.zoom()
            .scaleExtent([0.5, 4.8])
            .translateExtent(extent)
            .on("zoom", zoomed)
            .on("end", zoomEnd)
    );

}

const initReferentialObjects = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, referentialDate: Date, xRef: React.RefObject<d3.ScaleTime<number, number, never>>, height: number) => {
    const referentialDateStartX = xRef.current(referentialDate)
    const referentialDateEndX = xRef.current(new Date(referentialDate.getTime() + 1000 * 60 * 60 * 8))

    svg.append("g")
        .attr("id", "referentialZone")
        .append("rect")
        .attr("fill", "red")
        .attr("z-index", "0")
        .attr("opacity", 0.05)
        .attr("x", referentialDateStartX)
        .attr("y", 0)
        .attr("height", height)
        .attr("width", referentialDateEndX - referentialDateStartX);

    svg.on("mousemove", function (event) {
        const [mouseX] = d3.pointer(event);

        if (mouseX < 150) {
            svg.selectAll("#referentialLineShadow line, #referentialLineShadow text").attr("opacity", 0);
        } else {
            const transform = d3.zoomTransform(svg.node() as SVGSVGElement);
            const newX = transform.invertX(mouseX);
            const newXX = transform.applyX(newX)
            const date = xRef.current.invert(newX);
            svg.selectAll("#referentialLineShadow line, #referentialLineShadow text")
                .attr("x1", newXX)
                .attr("x2", newXX)
                .attr("x", newXX)
                .text(d3.utcFormat("%m-%d-%H-%M")(date))
                .attr("opacity", 0.5);
        }

    }).on("mouseleave", function () {
        svg.selectAll("#referentialLineShadow line, #referentialLineShadow text").attr("opacity", 0);
    });


    svg.append("g")
        .attr("id", "referentialLine")
        .append("line")
        .attr("stroke", "red")
        .attr("x1", referentialDateStartX)
        .attr("x2", referentialDateStartX)
        .attr("y1", 0)
        .attr("y2", height)
    svg.select("#referentialLine")
        .append("text")
        .datum(referentialDate.getTime())
        .attr("y", 0)
        .attr("x", referentialDateStartX)
        .attr("fill", "white")
        .attr("font", "bold 6px")
        .text(d3.utcFormat("%m-%d-%H-%M")(xRef.current.invert(referentialDateStartX)))

    svg.append("g")
        .attr("id", "referentialLineShadow")
        .append("line")
        .attr("stroke", "red")
        .attr("stroke-width", "0.5")
        .attr("y1", 0)
        .attr("y2", height)
        .attr("opacity", 0)
    svg.select("#referentialLineShadow")
        .append("text")
        .attr("y", 0)
        .attr("x", referentialDateStartX)
        .attr("fill", "white")
        .attr("font", "bold 6px")
        .text(d3.utcFormat("%m-%d-%H-%M")(xRef.current.invert(referentialDateStartX)))

    svg.on("click", (event) => {
        const transform = d3.zoomTransform(svg.node() as SVGSVGElement);
        const [pointX] = d3.pointer(event);
        if (pointX < 150) {
            svg.selectAll("#referentialLineShadow line, #referentialLineShadow text").attr("opacity", 0);
        } else {
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
        }

    });
    svg.on("dblclick", null);
}

