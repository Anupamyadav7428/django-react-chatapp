import { useEffect, useState } from 'react';
import './App.css';
import Login from './login';
import Register from './register';
import Home from './home';
import Room from './room';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [isLogin, setIsLogin] = useState(false); // default false
  const [error, setError] = useState("");
  const [succmsg, setSuccmsg] = useState("");
  // const [username, setUsername] = useState("");

  // Auto-hide notifications after 3s
  useEffect(() => {
    if (!error && !succmsg) return;

    const timer = setTimeout(() => {
      setError("");
      setSuccmsg("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [error, succmsg]);

  return (
    <>
      {/* Notifications */}
      {error && (
        <div className="Notification fixed top-5 right-5 z-60">
          <div className="flex items-center bg-red-100 text-red-800 px-4 py-2 rounded shadow">
            <p>{error}</p>
          </div>
        </div>
      )}
      {succmsg && (
        <div className="Notification fixed top-5 right-5 z-60">
          <div className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded shadow">
            <p>{succmsg}</p>
          </div>
        </div>
      )}

      {isLogin && <div className=' fixed top-5 right-5 z-50'> <button className='flex items-center bg-red-100 text-red-800 px-4 py-2 rounded shadow' onClick={()=>{localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("username");
        setIsLogin(false);
      }}>Logout</button></div>}

      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={<Login setIsLogin={setIsLogin} setError={setError}  setSuccmsg={setSuccmsg} />}
          />
          <Route
            path="/register"
            element={<Register setError={setError} setSuccmsg={setSuccmsg} />}
          />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={isLogin ? <Home /> : <Navigate to="/" />}
          />
          <Route
            path="/room/:slug"
            element={isLogin ? <Room /> : <Navigate to="/" />}
          />

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
