import type {CSSProperties} from "react";
export interface Tasks {
    [key:string]: Tasks
}

export interface Task {
    id: string,
    objectType: string,
    name: string,
    startDate: Date,
    endDate?: Date,
    hidden: boolean,
    path: string;
}
export interface GanttTask extends Task {
    onClick(): void;
}
// --- Constantes configurables ---
export const GANTT_CONFIG = {
    marginTop: 30,
    rowHeight: 24,
    indentWidth: 20,
    labelWidth: 150,
    separation: 2,
    rectangleColor: "#69b3a2",
    axisStroke: "#69b3a2",
    axisStrokeWidth: 3,
    textFontSize: "16px",
    textColor: "#69b3a2",
    tickNumber:7,
    hoverFill: "red",
    hoverStroke: "black",
};

export interface Line {
    y: number,
    x: number,
    width: number,
    style: Style,
    name: string,
    hidden: boolean
}

export interface Style extends CSSProperties {
    icon?: IconSettings
}

export interface IconSettings {
    x: number,
    path: string
}

export interface Grid {
    width: number;
    height: number;
    startDate: Date;
    endDate: Date;
}

export const dateToPixel = (date: Date, grid: Grid): number => (dateToPixelPercent(date, grid) * grid.width )/100


const dateToPixelPercent = (date: Date, grid: Grid): number => {
    const gridDateRange = grid.endDate.getTime() - grid.startDate.getTime();
    return ((date.getTime() - grid.startDate.getTime()) / gridDateRange) * 100;
}






