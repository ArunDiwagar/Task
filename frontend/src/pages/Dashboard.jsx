import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchTasks } from "../store/taskSlice";
import KanbanView from "../components/KanbanView";
import TaskListView from "../components/TaskListView";

const Dashboard = () => {
  const [view, setView] = useState("list");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { task } = useSelector((state) => state.task);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* Toggle Switch */}
        <div className="flex items-center gap-4">
          <span className="text-sm">{view === "kanban" ? "Kanban View" : "List View"}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={view === "kanban"}
              onChange={() => setView(view === "kanban" ? "list" : "kanban")}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Conditionally Render List or Kanban View */}
      {view === "kanban" ? <KanbanView tasks={task} /> : <TaskListView tasks={task} />}
    </div>
  );
};

export default Dashboard;
