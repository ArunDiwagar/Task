import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import AddTaskPage from "./pages/AddTaskPage";
import EditTask from "./pages/EditTask";

// Private Route Component
const PrivateRoute = ({ element }) => {
  const { token } = useSelector((state) => state.auth);
  return token ? element : <Navigate to="/login" />;
};

const App = () => {
  const { token } = useSelector((state) => state.auth);

  return (
    <Router>
      {token && <Header />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <RegisterPage />} />

        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/add-task" element={<PrivateRoute element={<AddTaskPage />} />} />
        <Route path="/edit/:id"  element={<PrivateRoute element={<EditTask />} />} />
      </Routes>
    </Router>
  );
};

export default App;
