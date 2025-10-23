import type {Task} from "./gantt.ts";

export const data :Task[]= [
    {
        id: "1",
        objectType: "project",
        name: "Technique",
        startDate: new Date("2025-10-23T00:00:00Z"),
        endDate: new Date("2025-10-26T00:00:00Z"),
        hidden: false,
        path: "Technique"
    },
    {
        id: "2",
        objectType: "task",
        name: "Analyse",
        startDate: new Date("2025-10-23T00:00:00Z"),
        endDate: new Date("2025-10-24T00:00:00Z"),
        hidden: false,
        path: "Technique/Analyse"
    },
    {
        id: "3",
        objectType: "task",
        name: "Design",
        startDate: new Date("2025-10-25T00:00:00Z"),
        endDate: undefined,
        hidden: false,
        path: "Technique/Design"
    },
    {
        id: "4",
        objectType: "task",
        name: "UI",
        startDate: new Date("2025-10-26T00:00:00Z"),
        endDate: undefined,
        hidden: false,
        path: "Technique/Design/UI"
    },
    {
        id: "5",
        objectType: "task",
        name: "Backend",
        startDate: new Date("2025-10-23T00:00:00Z"),
        endDate: new Date("2025-10-25T00:00:00Z"),
        hidden: false,
        path: "Technique/Backend"
    },
    {
        id: "6",
        objectType: "project",
        name: "Management",
        startDate: new Date("2025-10-24T00:00:00Z"),
        endDate: new Date("2025-10-27T00:00:00Z"),
        hidden: false,
        path: "Management"
    },
    {
        id: "7",
        objectType: "task",
        name: "Préparation",
        startDate: new Date("2025-10-24T00:00:00Z"),
        endDate: new Date("2025-10-24T12:00:00Z"),
        hidden: false,
        path: "Management/Préparation"
    },
    {
        id: "8",
        objectType: "task",
        name: "Execution",
        startDate: new Date("2025-10-25T00:00:00Z"),
        endDate: new Date("2025-10-26T00:00:00Z"),
        hidden: false,
        path: "Management/Execution"
    },
]