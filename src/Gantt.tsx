import {JSX, useState} from "react";
import type {Grid, Line, Style, Task} from "./gantt.ts";

export const Gantt = () => {
    const handleVisibilityToggle = (task: Task, index: number) => {
        const arrayToUpdate = [...tasks];
        arrayToUpdate[index] = {...task, hidden: !task.hidden}
        setTasks(arrayToUpdate)
    };

    const [tasks, setTasks] = useState<Task[]>(mockTasks);
    return (
        <div style={{display: "flex", flexDirection: "row"}}>
            <svg width={250} height={grid.height} viewBox={`0 0 ${250} ${grid.height}`}>
                {
                    tasks.map((task, index) => {
                            const x = 15 * task.path.split("/").length
                            const y = index * 30 + 20
                            return !task.hidden && <>
                                <text x={x} y={y} height={20}>{task.name}</text>
                                {task.path.split("/").length > 2 &&
                                    <rect onClick={() => handleVisibilityToggle(task, index)}
                                          x={x - 12}
                                          y={y - 10} height={10} width={10}></rect>
                                }
                                <line x1={0} x2={250} y1={y} y2={y} stroke="black"/>
                            </>
                        }
                    )}
            </svg>

            <svg width={10} height={grid.height} viewBox={`0 0 ${10} ${grid.height}`}>
                <rect width={3} y={-20} height={grid.height} fill={"black"}/>
            </svg>

            <svg width={grid.width} height={grid.height} viewBox={`0 0 ${grid.width} ${grid.height}`}>
                {tasks.map((task, index) => <Line key={index} line={taskToLine(task, grid, index)} index={index} />)}
            </svg>
        </div>
    );
}

const Line = (props:{line: Line, index:number}): JSX.Element => {
    const {line} = props;
    return !line.hidden && <>
        <rect x={line.x} y={(line.y) - 20} width={line.width} height={20}
              style={line.style}>{line.name}</rect>
        <line x1={0} x2={grid.width} y1={line.y} y2={line.y} stroke="black"/>
    </>
}

const grid: Grid = {
    width: 500,
    height: 600,
    startDate: new Date("2025-10-17"),
    endDate: new Date("2025-10-21"),
}


const mockStyle: Style = {fill: "blue"}

const taskToLine = (task: Task, grid: Grid, index: number): Line => {
    const dateSpan = grid.endDate.getTime() - grid.startDate.getTime();
    const t = ((task.startDate.getTime() - grid.startDate.getTime()) * 100) / dateSpan
    const w = task.endDate ? ((task.endDate.getTime() - grid.startDate.getTime()) * 100) / dateSpan : 10
    return {
        x: t * grid.width / 100,
        width: w * grid.width / 100,
        y: index * 30 + 20,
        style: mockStyle,
        name: task.name,
        hidden: task.hidden
    }
}


const mockTasks: Task[] = [
    {
        id: "task-1",
        name: "Design Wireframes",
        startDate: new Date("2025-10-17T09:00:00Z"),
        endDate: new Date("2025-10-18T17:00:00Z"),
        hidden: false,
        path: "project/design",
    },
    {
        id: "task-2",
        name: "UI Review",
        startDate: new Date("2025-10-17T11:00:00Z"),
        hidden: false,
        path: "project/design/ui-review",
    },
    {
        id: "task-3",
        name: "Backend Setup",
        startDate: new Date("2025-10-17T10:00:00Z"),
        endDate: new Date("2025-10-19T08:00:00Z"),
        hidden: false,
        path: "project/backend",
    },
    {
        id: "task-4",
        name: "Database Schema Design",
        startDate: new Date("2025-10-17T12:00:00Z"),
        endDate: new Date("2025-10-18T18:00:00Z"),
        hidden: false,
        path: "project/backend/database/schema",
    },
    {
        id: "task-5",
        name: "API Integration",
        startDate: new Date("2025-10-18T08:00:00Z"),
        endDate: new Date("2025-10-19T18:00:00Z"),
        hidden: false,
        path: "project/backend/api-integration",
    },
    {
        id: "task-6",
        name: "Authentication Module",
        startDate: new Date("2025-10-17T14:00:00Z"),
        hidden: false,
        path: "project/backend/auth",
    },
    {
        id: "task-7",
        name: "Frontend Implementation",
        startDate: new Date("2025-10-17T13:00:00Z"),
        endDate: new Date("2025-10-18T23:59:00Z"),
        hidden: false,
        path: "project/frontend",
    },
    {
        id: "task-8",
        name: "UI Components Setup",
        startDate: new Date("2025-10-17T15:00:00Z"),
        endDate: new Date("2025-10-18T21:00:00Z"),
        hidden: false,
        path: "project/frontend/components",
    },
    {
        id: "task-9",
        name: "Testing & QA",
        startDate: new Date("2025-10-18T09:30:00Z"),
        hidden: false,
        path: "project/qa/testing",
    },
    {
        id: "task-10",
        name: "Bug Fix Round 1",
        startDate: new Date("2025-10-18T11:00:00Z"),
        endDate: new Date("2025-10-19T15:00:00Z"),
        hidden: false,
        path: "project/qa/bugfix-round1",
    },
    {
        id: "task-11",
        name: "Performance Optimization",
        startDate: new Date("2025-10-18T12:00:00Z"),
        hidden: false,
        path: "project/qa/optimization",
    },
    {
        id: "task-12",
        name: "Documentation Draft",
        startDate: new Date("2025-10-17T16:30:00Z"),
        endDate: new Date("2025-10-18T20:00:00Z"),
        hidden: false,
        path: "project/qa/draft",
    },
    {
        id: "task-13",
        name: "Client Feedback Review",
        startDate: new Date("2025-10-18T10:00:00Z"),
        endDate: new Date("2025-10-19T09:00:00Z"),
        hidden: false,
        path: "project/feedback/review",
    },
    {
        id: "task-14",
        name: "Deployment Prep",
        startDate: new Date("2025-10-18T18:00:00Z"),
        hidden: false,
        path: "project/deployment/prep",
    },
    {
        id: "task-15",
        name: "Release Notes Finalization",
        startDate: new Date("2025-10-19T06:00:00Z"),
        endDate: new Date("2025-10-19T23:00:00Z"),
        hidden: false,
        path: "project/release/notes",
    },
];