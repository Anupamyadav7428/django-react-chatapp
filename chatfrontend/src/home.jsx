import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [createRoom, setCreateRoom] = useState("");
  const [joinRoomSlug, setJoinRoomSlug] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  // Handle input changes
  const handleCreateChange = (e) => setCreateRoom(e.target.value);
  const handleJoinChange = (e) => setJoinRoomSlug(e.target.value);

  // Create a new room
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ room_name: createRoom }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Room created successfully!");
        navigate(`/room/${data.slug}`);
      } else {
        alert(data.error || "Failed to create room");
      }
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  // Join an existing room
  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/join/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ room_slug: joinRoomSlug }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Joined room: ${data.name}`);
        navigate(`/room/${data.slug}`);
      } else {
        alert(data.error || "Failed to join room");
      }
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 flex flex-col items-center justify-center p-4 space-y-8">
      {/* Create Room Card */}
      <div className="w-full max-w-md p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-3xl shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Create Room</h2>
        <form className="flex flex-col space-y-4" onSubmit={handleCreateSubmit}>
          <input
            className="bg-white/20 placeholder-white/60 text-white p-3 rounded-xl border border-white/20
                       focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
            type="text"
            onChange={handleCreateChange}
            value={createRoom}
            placeholder="Enter room name"
            required
          />
          <button
            className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300"
            type="submit"
          >
            Create
          </button>
        </form>
      </div>

      {/* Join Room Card */}
      <div className="w-full max-w-md p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-3xl shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Join Room</h2>
        <form className="flex flex-col space-y-4" onSubmit={handleJoinSubmit}>
          <input
            className="bg-white/20 placeholder-white/60 text-white p-3 rounded-xl border border-white/20
                       focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
            type="text"
            onChange={handleJoinChange}
            value={joinRoomSlug}
            placeholder="Enter room slug"
            required
          />
          <button
            className="bg-green-400 hover:bg-green-500 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-300"
            type="submit"
          >
            Join
          </button>
        </form>
      </div>
    </div>
  );
}
