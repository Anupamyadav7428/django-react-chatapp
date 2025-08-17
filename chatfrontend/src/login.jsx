import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsLogin, setError , setSuccmsg}) {
  const [formdata, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log("Formdata updated:", formdata);
  }, [formdata]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // reset error

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formdata.username,
          password: formdata.password,
        }),
      });

      const data = await res.json();
      console.log("Response data:", data);

      if (res.ok && data.access && data.refresh) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        const decoded = jwtDecode(data.access); // decode the JWT
        console.log("Decoded token:", decoded);
        setIsLogin(true);
        localStorage.setItem("username",  decoded.username);
        // setUsername(decoded.username);
        navigate("/home");
        let succmsg="Login successful";
        setSuccmsg(succmsg);
      } else {
        setError("Invalid credentials");
        setIsLogin(false);
      }
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center 
                      w-full max-w-sm p-6 rounded-3xl 
                      bg-white/10 border border-white/20 
                      backdrop-blur-3xl shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-6">Login</h2>

        <form className="flex flex-col w-full" onSubmit={handleSubmit}>
          <label className="mb-4 text-white">
            Username
            <input
              className="bg-white/20 placeholder-white/60 text-white p-3 mt-2 mb-2 w-full rounded-xl border border-white/20
                         focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
              type="text"
              onChange={handleChange}
              placeholder="Enter your username"
              value={formdata.username}
              name="username"
              required
            />
          </label>

          <label className="mb-4 text-white">
            Password
            <input
              className="bg-white/20 placeholder-white/60 text-white p-3 mt-2 mb-4 w-full rounded-xl border border-white/20
                         focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
              type="password"
              onChange={handleChange}
              placeholder="Enter your password"
              value={formdata.password}
              name="password"
              required
            />
          </label>

          <button
            className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300"
            type="submit"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-white">
          <p className="mb-2">Don't have an account?</p>
          <button
            className="text-blue-300 underline hover:text-blue-400 font-medium transition-colors duration-300"
            onClick={() => navigate("/register")}
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
}
