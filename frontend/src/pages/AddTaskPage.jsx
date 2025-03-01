import AddTask from "../components/AddTask";
import { useNavigate } from "react-router-dom";

const AddTaskPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <button className="bg-gray-500 text-white px-4 py-2 rounded-md mb-4" onClick={() => navigate("/")}>
        ← Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-4">Add New Task</h1>
      <AddTask />
    </div>
  );
};

export default AddTaskPage;
