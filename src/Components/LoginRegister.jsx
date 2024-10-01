import axios from "axios";
import { useState } from "react";

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register forms
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === "login") {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    } else {
      setRegisterData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "todos-backend-rouge.vercel.app/api/user/login",
        {
          email: loginData.email,
          password: loginData.password,
        }
      );
      const token = response.data.token;
      localStorage.setItem("key", `${token}`);
      console.log("Login Success:", token);
      window.location.href = "/home";
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(
        "todos-backend-rouge.vercel.app/api/user/register",
        {
          userName: registerData.userName,
          email: registerData.email,
          password: registerData.password,
        }
      );
      console.log("Registration Success:", response.data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-around mb-6">
          <button
            onClick={() => {
              setIsLogin(true);
              setErrorMessage("");
            }}
            className={`${
              isLogin ? "text-blue-500" : "text-gray-500"
            } font-bold text-lg`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setErrorMessage("");
            }}
            className={`${
              !isLogin ? "text-blue-500" : "text-gray-500"
            } font-bold text-lg`}
          >
            Register
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 text-red-500 text-center">{errorMessage}</div>
        )}

        {/* Login Form */}
        {isLogin && (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={(e) => handleInputChange(e, "login")}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-semibold">Password</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={(e) => handleInputChange(e, "login")}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
            >
              Login
            </button>
          </form>
        )}

        {/* Register Form */}
        {!isLogin && (
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">UserName</label>
              <input
                type="text"
                name="userName"
                value={registerData.userName}
                onChange={(e) => handleInputChange(e, "register")}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your userName"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={(e) => handleInputChange(e, "register")}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Password</label>
              <input
                type="password"
                name="password"
                value={registerData.password}
                onChange={(e) => handleInputChange(e, "register")}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-semibold">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={registerData.confirmPassword}
                onChange={(e) => handleInputChange(e, "register")}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
            >
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginRegister;
