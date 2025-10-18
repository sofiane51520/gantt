import type {CSSProperties} from "react";

export interface Task {
    name: string,
    startDate: Date,
    endDate?: Date,
    hidden: boolean,
    path: string;
}


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

export interface Task {
    name: string;
    startDate: Date;
    endDate?: Date;
    hidden: boolean;
    path: string;
    id:string
}

export interface Grid {
    width: number;
    height: number;
    startDate: Date;
    endDate: Date;
}

