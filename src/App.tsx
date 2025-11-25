import './App.css'
import {GanttChart} from "./Gantt.tsx";
import {useState} from "react";
import type {GanttTask, Task} from "./gantt.ts";
import {data} from "./data.ts";

function App() {
    const [ganttData, setGanttData] = useState<GanttTask[]>(data);

    // const visibleTasks = useMemo(() => {
    //     return data.filter(task => {
    //         const parts = task.path.split("/");
    //         const hasCollapsedAncestor = parts.slice(0, -1).some((_, i) => {
    //             const ancestor = parts.slice(0, i + 1).join("/");
    //             return collapsed[ancestor];
    //         });
    //         return !hasCollapsedAncestor && !task.hidden;
    //     });
    // }, [ganttData]);

    const handleTaskClick = (task: Task) => {

        const updatedTasks = ganttData.map(t => {
            if (t.path.startsWith(task.path) && t !== task){
                console.log("toto")
                return {...t, hidden: !task.hidden}
            }
            return t;
        });
        setGanttData(updatedTasks);
    };

    return (
        <div>
            <h2>Diagramme de Gantt</h2>
            <GanttChart
                onTaskClick={handleTaskClick}
                tasks={ganttData}
                width={1400}
                height={300}
                startDate={new Date("2025-10-22T00:00:00Z")}
                endDate={new Date("2025-10-25T00:00:00Z")}
                referentialDate={new Date("2025-10-23T10:00:00Z")}
            />
        </div>
    );

}

export default App
