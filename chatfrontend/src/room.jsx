import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

export default function Room() {
  const { slug } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  

  // const decoded = jwtDecode(data.access);
  const username = localStorage.getItem("username") || "Guest";
  

  useEffect(() => {
    console.log(`this is username: ${username}`);
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${slug}/`);

    ws.onopen = () => console.log("Connected to room:", slug);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message) setMessages((prev) => [...prev, data.message]);
    };

    ws.onclose = () => console.log("Disconnected from room");

    setSocket(ws);

    return () => ws.close();
  }, [slug, username]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN && input.trim() !== "") {
      socket.send(JSON.stringify({ message: input, username }));
      setInput("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-100 p-4">
      <div className="w-full max-w-3xl flex flex-col bg-white/20 backdrop-blur-xl rounded-xl shadow-xl p-6 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Room: {slug}</h2>
          <span className="text-gray-700 font-medium">Logged in as: {username}</span>
        </div>

        <div className="flex-1 overflow-y-auto h-96 p-4 space-y-2 bg-white/30 backdrop-blur-md rounded-lg border border-white/30">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-md ${
                msg.includes(username) ? "bg-green-200/60 text-green-900 self-end" : "bg-white/40 text-gray-900"
              }`}
              dangerouslySetInnerHTML={{ __html: msg }}
            />
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-lg border border-white/40 bg-white/30 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-md transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
