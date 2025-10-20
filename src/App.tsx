import './App.css'
import {GanttChart} from "./Gantt.tsx";
import {useMemo, useState} from "react";
import type {Task} from "./gantt.ts";

function App() {

        const tasks: Task[] = useMemo(
            () => [
                { id: "1", objectType: "project", name: "Projet A", startDate: new Date("2025-10-20T00:00:00Z"), endDate: new Date("2025-10-26T00:00:00Z"), hidden: false, path: "ProjetA" },
                { id: "2", objectType: "task", name: "Analyse", startDate: new Date("2025-10-20T00:00:00Z"), endDate: new Date("2025-10-21T00:00:00Z"), hidden: false, path: "ProjetA/Analyse" },
                { id: "3", objectType: "task", name: "Design", startDate: new Date("2025-10-21T00:00:00Z"), endDate: undefined, hidden: false, path: "ProjetA/Design" },
                { id: "4", objectType: "task", name: "UI", startDate: new Date("2025-10-22T00:00:00Z"), endDate: undefined, hidden: false, path: "ProjetA/Design/UI" },
                { id: "5", objectType: "task", name: "Backend", startDate: new Date("2025-10-23T00:00:00Z"), endDate: new Date("2025-10-25T00:00:00Z"), hidden: false, path: "ProjetA/Backend" },
                { id: "6", objectType: "project", name: "Projet B", startDate: new Date("2025-10-24T00:00:00Z"), endDate: new Date("2025-10-27T00:00:00Z"), hidden: false, path: "ProjetB" },
                { id: "7", objectType: "task", name: "Préparation", startDate: new Date("2025-10-24T00:00:00Z"), endDate: new Date("2025-10-24T12:00:00Z"), hidden: false, path: "ProjetB/Préparation" },
                { id: "8", objectType: "task", name: "Execution", startDate: new Date("2025-10-25T00:00:00Z"), endDate: new Date("2025-10-26T00:00:00Z"), hidden: false, path: "ProjetB/Execution" },
            ], []);

        const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

        const visibleTasks = useMemo(() => {
            return tasks.filter(task => {
                const parts = task.path.split("/");
                // Si un ancêtre est plié → tâche masquée
                for (let i = 1; i < parts.length; i++) {
                    const ancestor = parts.slice(0, i).join("/");
                    if (collapsed[ancestor]) return false;
                }
                return !task.hidden;
            });
        }, [tasks, collapsed]);

        const handleTaskClick = (task: Task) => {
            const isParent = tasks.some(t => t.path.startsWith(task.path + "/"));
            if (!isParent) return;
            setCollapsed(prev => ({
                ...prev,
                [task.path]: !prev[task.path],
            }));
        };

        return (
            <div>
                <h2>Diagramme de Gantt</h2>
                <GanttChart
                    tasks={visibleTasks.map(t => ({...t, onClick: () => handleTaskClick(t)}))}
                    width={900}
                    height={300}
                    startDate={new Date("2025-10-20T00:00:00Z")}
                    endDate={new Date("2025-10-27T00:00:00Z")}
                />
            </div>
        );

}

export default App
