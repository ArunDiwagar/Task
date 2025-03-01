import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};

    if (!user.username.trim()) {
      newErrors.username = "Username is required.";
    }

    if (!user.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(user.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!user.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (user.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    } else if (!/\d/.test(user.password)) {
      newErrors.password = "Password must contain at least one number.";
    } else if (!/[!@#$%^&*]/.test(user.password)) {
      newErrors.password = "Password must contain at least one special character.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    try {
      const resultAction = await dispatch(registerUser(user));
      console.log("Register response:", resultAction);
  
      // Extract response payload
      const response = resultAction.payload;
  
      if (resultAction.error) {
        // Ensure response is a string before checking includes
        const errorMessage = response || resultAction.error.message || "Registration failed. Please try again.";
  
        if (typeof errorMessage === "string" && errorMessage.includes("User already exists")) {
          setErrors({ email: "Email is already registered." });
        } else {
          setErrors({ general: errorMessage });
        }
        return;
      }
  
      navigate("/login", { state: { email: user.email, password: user.password } });
    } catch (error) {
      setErrors({ general: "Registration failed. Please try again." });
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-blue-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Register</h2>
        
        {errors.general && <p className="text-red-500 text-sm text-center mb-4">{errors.general}</p>}

        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input
            className="border p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
            type="text"
            placeholder="Username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

          <input
            className="border p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <div className="relative">
            <input
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-green-400 outline-none"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-2xl"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🐣" : "🥚"}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <button className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-200">
            Register
          </button>
        </form>

        <p className="text-gray-600 text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
