import {useEffect, useRef} from "react";
import {GANTT_CONFIG, type GanttProps, type GanttTask, type Task} from "./gantt.ts";
import {type NumberValue, scaleLog} from "d3";
import * as d3 from "d3";

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
            Yaxis,
            axis2,
            x,
            y,
            XaxisGroup,
            YaxisGroup,
            axis2Group
        } = initAxes(svg, tasks, height, [startDate, endDate], [labelWidth + separation, width - 20])
        xRef.current = x;
        displayData(svg, tasks, x)
        initReferentialObjects(svg, referentialDate, x, height)
        initZoom(xRef, svg, Xaxis, Yaxis, XaxisGroup, YaxisGroup, axis2, axis2Group, x, y, width, height);
    }, []);

    useEffect(() => {
        if (svgRef.current) {
            const svg = d3.select(svgRef.current)
            svg.selectAll(".tasks").remove();
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

const initAxes = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, tasks: Task[], height: number, domain: [Date, Date], range: [number, number]) => {
    const {
        tickNumber,
    } = GANTT_CONFIG;

    const x: d3.ScaleTime<number, number, never> = d3.scaleUtc()
        .domain(domain)
        .range(range);
    const x2: d3.ScaleTime<number, number, never> = d3.scaleUtc()
        .domain(domain)
        .range(range);

    const y = d3.scaleLinear().domain([0, tasks.length * 20]).range([0, tasks.length * 20]);

    const Xaxis: d3.Axis<Date | NumberValue> = d3.axisTop(x).ticks(tickNumber, d3.utcFormat("%H:%M"));
    const Yaxis = d3.axisRight(y).ticks(20)/*.tickSize(0).tickSizeInner(0).tickSizeOuter(0)*/
    const axis2: d3.Axis<Date | NumberValue> = d3.axisTop(x2).ticks(d3.utcDay.every(1), d3.utcFormat("%d %b"))
    const XaxisGroup: d3.Selection<SVGGElement, unknown, null, undefined> = svg.append("g")
        .attr("class", "Xaxis")
        .call(Xaxis).raise()

    const YaxisGroup: d3.Selection<SVGGElement, unknown, null, undefined> = svg.append("g")
        .attr("class", "Yaxis")
        .call(Yaxis).raise()

    const axis2Group = svg.append("g")
        .attr("class", "axis2")
        .attr("transform", `translate(0,${-25})`)
        .call(axis2).raise()

    // axis2Group.selectAll("text")
    //     .attr("transform",`translate(${(axis2.scale().range()[1] - axis2.scale().range()[0] / axis2Group.selectAll("text").size()) / 2.2},0)`)

    return {Xaxis, Yaxis, axis2, x, y, XaxisGroup, YaxisGroup, axis2Group};
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

    taskGroups.append("rect")
        .attr("x", (task: GanttTask) => {
            // console.log("x",Math.max(labelWidth + separation,x(task.startDate)))
            return Math.max(labelWidth + separation, x(task.startDate))
        })
        .attr("y",(_task: GanttTask, index: number) => index * rowHeight + 5)
        .attr("height", rowHeight - 4)
        .attr("width", (task: GanttTask) => {
            const end = task.endDate ?? new Date(task.startDate.getTime() + 60 * 60 * 1000);
            // console.log("width", x(end) - x(task.startDate))
            return x(end) - x(task.startDate);
        })
        .attr("fill", rectangleColor)
        .on("mouseover", function (event, data) {
            const [mouseX, mouseY] = d3.pointer(event);
            const transform = d3.zoomTransform(svg.node() as SVGSVGElement);
            const newPosition = transform.invert([mouseX, mouseY]);
            const newPositionP = transform.apply(newPosition)

            const y = event.currentTarget.y.baseVal.value

            svg.append("text").attr("class", "tooltip").attr("fill", "white").text(data.name).attr("x", newPositionP[0] + 20).attr("y", y - 20)
        })
        .on("mouseout", function () {
            svg.selectAll(".tooltip").remove()
        });

    taskGroups.append("text")
        .attr("x", (task: GanttTask) => getLevel(task) * indentWidth + 5)
        .attr("y",(_task: GanttTask, index: number) => index * rowHeight + 5)
        .attr("dominant-baseline", "middle")
        .attr("fill", textColor)
        .attr("font-size", textFontSize)
        .style("cursor", "pointer")
        .on("click", (_event, task: GanttTask) => task.onClick())
        .text((task: GanttTask) => task.name);
}

const initZoom = (xRef: React.RefObject<d3.ScaleTime<number, number, never>>, svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, Xaxis: d3.Axis<Date | NumberValue>, Yaxis: d3.Axis<NumberValue>, XaxisGroup: d3.Selection<SVGGElement, unknown, null, undefined>, YaxisGroup: d3.Selection<SVGGElement, unknown, null, undefined>, axis2: d3.Axis<Date | NumberValue>, axis2Group: d3.Selection<SVGGElement, unknown, null, undefined>, x: d3.ScaleTime<number, number, never>, y: d3.ScaleLinear<number, number, never>, width: number, height: number) => {
    const {
        labelWidth,
        separation,
        marginTop
    } = GANTT_CONFIG;

    const zoomed = (event: d3.D3ZoomEvent<SVGSVGElement, GanttTask>) => {
        const newX = event.transform.rescaleX(x);
        // const newY = event.transform.rescaleX(y);
        XaxisGroup.call(Xaxis.scale(newX)).raise();
        // YaxisGroup.call(Yaxis.scale(newY)).raise();
        axis2Group.call(axis2.scale(newX)).raise();

        xRef.current = newX;

        svg.selectAll(".task rect").attr("transform", `translate(${event.transform.x}, 0) scale(${event.transform.k}, 1)`)
        svg.select("#referentialZone rect").attr("transform", `translate(${event.transform.x}, 0) scale(${event.transform.k}, 1)`)

        const currentDate = svg.select("#referentialLine text").datum() as number
        svg.select("#referentialLine line").attr("x1", newX(currentDate)).attr("x2", newX(currentDate))
        svg.select("#referentialLine text").attr("x", newX(currentDate))

        svg.select("#referentialLineShadow line").attr("opacity", 0)
    }

    const zoomEnd = () => {
        svg.select("#referentialLineShadow line").attr("opacity", 0.5)
    }

    const dragged = (event: d3.D3DragEvent<SVGSVGElement, GanttTask, {x:number, y:number}>) => {
        // const oldRange = [...y.range()]
        // YaxisGroup.call(Yaxis.scale(y.range([oldRange[0] + event.dx, oldRange[1] + event.dy])))
        // const newY = event.y + event.subject.y;
        // const newX = event.x + event.subject.x;
        svg.selectAll<SVGSVGElement, Task>(".task").nodes().forEach((e)=> {
            // console.log(e.children[0].x.baseVal.value)
            e.children[0].setAttribute("y",e.children[0].y.baseVal.value + event.dy)
            e.children[1].setAttribute("y",e.children[0].y.baseVal.value + event.dy)
            e.children[0].setAttribute("x",e.children[0].x.baseVal.value + event.dx)
            // e.children[1].setAttribute("x",e.children[0].x.baseVal.value + event.dx)
            // console.log(e.setAttribute("y",e.children[0].y.baseVal[0].value + event.dy))
            // console.log(e.y.baseVal[0].value)
            // svg.select(e).attr("y",e.y.baseVal[0].value + event.dy)
            // e.y = e.y.baseVal[0].value + event.dy
        })
        // svg.selectAll(".task text").attr("transform", `translate(0, ${newY})`)
        // svg.selectAll(".task rect").attr("transform", `translate(${newX}, ${newY})`)
    }

    const extent: [[number, number], [number, number]] = [[labelWidth + separation, marginTop], [width, 1200]];
    svg.call(
        // @ts-expect-error dsddsqdsq
        d3.drag(".Yaxis").subject((event) => ({x:event.x, y:event.y})).on("drag", dragged)
    );
    svg.call(
        // @ts-expect-error dsqd dsq
        d3.zoom()
            .scaleExtent([0.5, 12])
            .translateExtent(extent)
            .on("zoom", zoomed)
            .on("end", zoomEnd)
    );

}

const initReferentialObjects = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, referentialDate: Date, x: d3.ScaleTime<number, number, never>, height: number) => {
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

