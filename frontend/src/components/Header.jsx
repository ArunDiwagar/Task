import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between">
      <h1 className="text-lg font-bold">Task Manager</h1>
     <div ><button 
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-3"
            onClick={() => navigate("/add-task")}
          >
            + Add Task
          </button>
      <button className="bg-red-500 px-4 py-2 rounded" onClick={handleLogout}>
        Logout
      </button></div> 
    </header>
  );
};

export default Header;
