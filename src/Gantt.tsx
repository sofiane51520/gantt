import {useEffect, useRef} from "react";
import {GANTT_CONFIG, type GanttProps, type GanttTask, type Task} from "./gantt.ts";
import * as d3 from "d3";
import {type NumberValue} from "d3";

const getLevel = (task: GanttTask) => task.path.split("/").length - 1;

export function GanttChart({onTaskClick, tasks, width, height, startDate, endDate, referentialDate}: GanttProps) {
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
            y,
            XaxisGroup,
            axis2Group
        } = initAxes(xRef, svg, tasks, height, [referentialDate, new Date(referentialDate.getTime() + new Date(0).setHours(8))], [labelWidth + separation, width - 20], onTaskClick)
        xRef.current = x;
        // displayData(svg, tasks, xRef.current, onTaskClick)
        initReferentialObjects(svg, referentialDate, x, height)
        initZoom(xRef, svg, Xaxis, XaxisGroup, axis2, axis2Group, x, width, referentialDate, tasks, onTaskClick);
    }, []);

    useEffect(() => {
        if (svgRef.current) {
            const svg = d3.select(svgRef.current)
            console.log(tasks)
            // displayData(svg, tasks, xRef.current, onTaskClick)
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

const initAxes = (xRef: React.RefObject<d3.ScaleTime<number, number, never>>, svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, tasks: Task[], height: number, domain: [Date, Date], range: [number, number], onTaskClick) => {
    const {
        tickNumber,
        rowHeight
    } = GANTT_CONFIG;
    const visibleTasks = tasks.filter(t => !t.hidden);

    const x: d3.ScaleTime<number, number, never> = d3.scaleUtc()
        .domain(domain)
        .range(range).clamp(false);
    const x2: d3.ScaleTime<number, number, never> = d3.scaleUtc()
        .domain(domain)
        .range(range);
    const y = d3.scaleBand()
        .domain(tasks.map(t => t.id))
        .range([0, visibleTasks.length * rowHeight])
        .padding(0.1);


    const bars = svg.selectAll<SVGRectElement, GanttTask>("rect.task")
        .data(visibleTasks, (task: GanttTask) => task.id);
    // EXIT → transition + suppression
    bars.exit()
        .transition()
        .duration(250)
        .style("opacity", 0)
        .remove();

    // ENTER → création
    const enter = bars.enter()
        .append("rect")
        .attr("class", "task")
        .attr("height", y.bandwidth())
        .on("click", onTaskClick);

    // UPDATE + ENTER MERGE → repositionnement
    enter.merge(bars)
        .transition()
        .duration(250)
        .attr("y", task => y(task.id)!)
        .attr("x", task => x(task.startDate))
        .attr("width", task => {
            const end = task.endDate ?? new Date(task.startDate.getTime() + 60 * 60 * 1000);
            return x(end) - x(task.startDate);
        });

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

    return {Xaxis, axis2, x, y, XaxisGroup, axis2Group};
};

const displayData = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, data: GanttTask[], x: d3.ScaleTime<number, number, never>, onTaskClick: (task: GanttTask) => void) => {

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
        .attr("x", (task: GanttTask) => x(task.startDate))
        .attr("y", (_task: GanttTask, index: number) => index * rowHeight + 5)
        .attr("hidden", (task) => task.hidden)
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
        .attr("visibility", (task) => task.hidden ? "hidden" : "visible")
        .attr("dominant-baseline", "middle")
        .attr("fill", textColor)
        .attr("font-size", textFontSize)
        .style("cursor", "pointer")
        .on("click", (_event, task: GanttTask) => onTaskClick(task))
        .text((task: GanttTask) => task.name);
}

const initZoom = (xRef: React.RefObject<d3.ScaleTime<number, number, never>>, svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, Xaxis: d3.Axis<Date | NumberValue>, XaxisGroup: d3.Selection<SVGGElement, unknown, null, undefined>, axis2: d3.Axis<Date | NumberValue>, axis2Group: d3.Selection<SVGGElement, unknown, null, undefined>, x: d3.ScaleTime<number, number, never>, width: number, referentialDate: Date, tasks: Task[], onTaskClick) => {
    const {
        labelWidth,
        separation,
        marginTop
    } = GANTT_CONFIG;

    const zoomed = (event: d3.D3ZoomEvent<SVGSVGElement, GanttTask>) => {
        const contentGroup = svg.selectAll("rect.task");
        contentGroup.attr("transform", `translate(${event.transform.x}, 1) scale(${event.transform.k}, 1)`)

        // console.log({oldT: event.transform, newTransform});
        const newX = event.transform.scale(1 / event.transform.k).rescaleX(x);
        XaxisGroup.call(Xaxis.scale(newX)).raise();
        axis2Group.call(axis2.scale(newX)).raise();
        xRef.current = newX;

        const currentDate = svg.select("#referentialLine text").datum() as number

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

        const domainRange = x.domain()[1].getTime() - x.domain()[0].getTime();
        const zoomRatio = 1
        const pixelRange = x.range()[1] - x.range()[0];
        const pixelTimeRatio = (domainRange / pixelRange) * zoomRatio
        const timeShift = pixelTimeRatio * -event.dx


        x.domain([new Date(xRef.current.domain()[0].getTime() + timeShift), new Date(xRef.current.domain()[1].getTime() + timeShift)])
        XaxisGroup.call(d3.axisTop(x).ticks(tickNumber, d3.utcFormat("%H:%M")).tickSizeInner(-1000));
        axis2Group.call(axis2.scale(x));
        xRef.current = x;


        const contentGroup = svg.selectAll("rect.task");
        contentGroup.attr("transform", `translate(0, ${yOffset})`);


        // displayData(svg, tasks, xRef.current, onTaskClick);
        const currentDate = svg.select("#referentialLine text").datum() as number

        svg.select("#referentialLine line").attr("x1", x(currentDate)).attr("x2", x(currentDate))
        svg.select("#referentialLine text").attr("x", x(currentDate))
        svg.select("#referentialZone rect").attr("x", x(referentialDate.getTime()))

        svg.select("#referentialLineShadow line").attr("opacity", 0)
        svg.select("#referentialLineShadow text").attr("opacity", 0)
        d3.selectAll("g .tick line").style("opacity", 0.1);

    }
    let yOffset = 0;
    let xOffset = 0;
    let startY = 0;
    let startX = 0;
    let initialYOffset = 0;
    let initialXOffset = 0;

    let zoomStartTransform: any = null;

    const extent: [[number, number], [number, number]] = [[labelWidth + separation, marginTop], [width, 1200]];


    svg.call(
        // @ts-expect-error dsqd dsq
        d3.drag()
            .on("start", (event) => {
                startY = event.y;
                startX = event.x;
                initialYOffset = yOffset;
                initialXOffset = xOffset;
                zoomStartTransform = d3.zoomTransform(svg.node() as any);

            })
            .on("drag", (event) => {
                const contentGroup = svg.selectAll("rect.task");

                const dy = event.y - startY;
                const dx = event.x - startX;

                // const newT = zoomStartTransform.translate(dx, 0);


                yOffset = initialYOffset + dy;
                xOffset = initialXOffset + dx;
                const visibleTasks = tasks.filter(t => !t.hidden);
                yOffset = Math.min(0, yOffset);
                const maxScroll = -(visibleTasks.length * 24 - 300);
                yOffset = Math.max(yOffset, maxScroll);
                console.log(xOffset,yOffset )

                const newT = zoomStartTransform.translate(dx ,0);
                svg.call(zoomBehavior.transform, newT);


                // const t = d3.zoomTransform(svg.node() as any);

                // contentGroup.attr("transform", `translate(${t.x}, ${yOffset})`);

                // const {
                //     tickNumber,
                // } = GANTT_CONFIG;

                // const domainRange = x.domain()[1].getTime() - x.domain()[0].getTime();
                // const zoomRatio = 1
                // const pixelRange = x.range()[1] - x.range()[0];
                // const pixelTimeRatio = (domainRange / pixelRange) * zoomRatio
                // const timeShift = pixelTimeRatio * -event.dx

                // x.domain([new Date(xRef.current.domain()[0].getTime() + timeShift), new Date(xRef.current.domain()[1].getTime() + timeShift)])
                // XaxisGroup.call(d3.axisTop(x).ticks(tickNumber, d3.utcFormat("%H:%M")).tickSizeInner(-1000));
                // axis2Group.call(axis2.scale(x));
                // xRef.current = x;
                // d3.selectAll("g .tick line").style("opacity", 0.1);
                // const currentDate = svg.select("#referentialLine text").datum() as number
                //
                //
                // svg.select("#referentialLine line").attr("x1", x(currentDate)).attr("x2", x(currentDate))
                // svg.select("#referentialLine text").attr("x", x(currentDate))
                // svg.select("#referentialZone rect").attr("x", x(referentialDate.getTime()))
                //
                // svg.select("#referentialLineShadow line").attr("opacity", 0)
                // svg.select("#referentialLineShadow text").attr("opacity", 0)

            })
    );
    const zoomBehavior =d3.zoom()
        .scaleExtent([0.3,8])
        .translateExtent(extent)
        .on("zoom", zoomed)
        .on("end", zoomEnd)
// @ts-expect-error dsqd dsq
    svg.call(zoomBehavior);

}

const initReferentialObjects = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, referentialDate: Date, x: d3.ScaleTime<number, number, never>, height: number) => {
    const referentialDateStartX = x(referentialDate)
    const referentialDateEndX = x(new Date(referentialDate.getTime() + 1000 * 60 * 60 * 8))

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
            const date = x.invert(newX);
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
        .text(d3.utcFormat("%m-%d-%H-%M")(x.invert(referentialDateStartX)))

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
        .text(d3.utcFormat("%m-%d-%H-%M")(x.invert(referentialDateStartX)))

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

