import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editTask } from "../store/taskSlice";

const EditTask = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get the task from Redux or location state
  const tasks = useSelector((state) => state.task.task);
  const taskId = location.state?.id;
  const taskFromState = location.state?.task;
  const task = taskFromState || tasks.find((t) => t.id === taskId);

  // Local state for form fields
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Not Started");
  const [priority, setPriority] = useState("Medium");

  // Load old data when component mounts
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setStatus(task.status || "Not Started");
      setPriority(task.priority || "Medium");
    }
  }, [task]);

  const handleUpdate = async () => {
    if (!task?.id) {
      alert("Invalid task data");
      return;
    }

    try {
      await dispatch(
        editTask({
          id: task.id,
          title,
          status,
          priority,
        })
      ).unwrap();
      navigate("/"); 
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Error updating task. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border px-3 py-2 rounded-md mb-4"
        placeholder="Task Title"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full border px-3 py-2 rounded-md mb-4"
      >
        <option value="Not Started">Not Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full border px-3 py-2 rounded-md mb-4"
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={handleUpdate}
      >
        Update Task
      </button>
    </div>
  );
};

export default EditTask;
