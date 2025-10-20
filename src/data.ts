import type {Task} from "./gantt.ts";

export const data :Task[]= [
    {
        id: "1",
        objectType: "project",
        name: "Projet A",
        startDate: new Date("2025-10-20T00:00:00Z"),
        endDate: new Date("2025-10-26T00:00:00Z"),
        hidden: false,
        path: "ProjetA"
    },
    {
        id: "2",
        objectType: "task",
        name: "Analyse",
        startDate: new Date("2025-10-20T00:00:00Z"),
        endDate: new Date("2025-10-21T00:00:00Z"),
        hidden: false,
        path: "ProjetA/Analyse"
    },
    {
        id: "3",
        objectType: "task",
        name: "Design",
        startDate: new Date("2025-10-21T00:00:00Z"),
        endDate: undefined,
        hidden: false,
        path: "ProjetA/Design"
    },
    {
        id: "4",
        objectType: "task",
        name: "UI",
        startDate: new Date("2025-10-22T00:00:00Z"),
        endDate: undefined,
        hidden: false,
        path: "ProjetA/Design/UI"
    },
    {
        id: "5",
        objectType: "task",
        name: "Backend",
        startDate: new Date("2025-10-23T00:00:00Z"),
        endDate: new Date("2025-10-25T00:00:00Z"),
        hidden: false,
        path: "ProjetA/Backend"
    },
    {
        id: "6",
        objectType: "project",
        name: "Projet B",
        startDate: new Date("2025-10-24T00:00:00Z"),
        endDate: new Date("2025-10-27T00:00:00Z"),
        hidden: false,
        path: "ProjetB"
    },
    {
        id: "7",
        objectType: "task",
        name: "Préparation",
        startDate: new Date("2025-10-24T00:00:00Z"),
        endDate: new Date("2025-10-24T12:00:00Z"),
        hidden: false,
        path: "ProjetB/Préparation"
    },
    {
        id: "8",
        objectType: "task",
        name: "Execution",
        startDate: new Date("2025-10-25T00:00:00Z"),
        endDate: new Date("2025-10-26T00:00:00Z"),
        hidden: false,
        path: "ProjetB/Execution"
    },
]