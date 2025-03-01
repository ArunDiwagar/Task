import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/authSlice";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const LoginPage = () => {
  const location = useLocation();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.email && location.state?.password) {
      setCredentials({
        email: location.state.email,
        password: location.state.password,
      });
    }
  }, [location.state]);

  const validateForm = () => {
    let newErrors = {};

    if (!credentials.email) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(credentials.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!credentials.password) {
      newErrors.password = "Password is required.";
    } else if (credentials.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    try {
      const response = await dispatch(loginUser(credentials)).unwrap();
      if (response.success) {
        navigate("/dashboard");
      } else {
        setServerError(response.message || "Invalid email or password.");
      }
    } catch (err) {
      setServerError("Invalid email or password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Login</h2>
        
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            type="email"
            placeholder="Email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            required
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <div className="relative">
            <input
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 outline-none"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-2xl"
              onClick={() => setShowPassword(!showPassword)}
            >
              <motion.span
                animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                transition={{ duration: 2 }}
              >
                {showPassword ? "🐣":"🥚"}
              </motion.span>
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

          <button className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200">
            Login
          </button>
        </form>

        <p className="mt-4 text-gray-600 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
