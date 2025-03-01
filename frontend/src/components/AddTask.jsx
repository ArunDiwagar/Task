import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addTask, fetchTasks } from "../store/taskSlice";

const AddTask = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [task, setTask] = useState({
    title: "",
    status: "To Do",
    priority: "Medium",
  });

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(addTask(task));
    dispatch(fetchTasks());
    navigate("/"); // Redirect to dashboard after submission
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={task.title}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        <select name="status" value={task.status} onChange={handleChange} className="border p-2 rounded">
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select name="priority" value={task.priority} onChange={handleChange} className="border p-2 rounded">
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
          <option value="Urgent">Urgent</option>
        </select>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddTask;
