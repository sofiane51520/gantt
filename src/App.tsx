import './App.css'
import {GanttChart} from "./Gantt.tsx";
import {useMemo, useState} from "react";
import type {Task} from "./gantt.ts";
import {data} from "./data.ts";

function App() {
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

    const visibleTasks = useMemo(() => {
        return data.filter(task => {
            const parts = task.path.split("/");
            const hasCollapsedAncestor = parts.slice(0, -1).some((_, i) => {
                const ancestor = parts.slice(0, i + 1).join("/");
                return collapsed[ancestor];
            });
            return !hasCollapsedAncestor && !task.hidden;
        });
    }, [collapsed]);

    const handleTaskClick = (task: Task) => {
        const isParent = data.some(t => t.path.startsWith(task.path + "/"));
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
