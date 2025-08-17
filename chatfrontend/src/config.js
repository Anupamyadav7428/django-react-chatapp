// config.js

// ==========================
// Backend URLs
// ==========================

// Local Django server (development mode)
const DEV_BACKEND = "http://127.0.0.1:8000";

// Render backend (replace with your actual Render backend URL after deploy)
const PROD_BACKEND = "https://chatapp-backend.onrender.com"; 

// ==========================
// API Base URL
// ==========================
const API_BASE_URL =
  import.meta.env.MODE === "development" ? DEV_BACKEND : PROD_BACKEND;

// ==========================
// WebSocket Base URL
// ==========================
const WS_BASE_URL =
  import.meta.env.MODE === "development"
    ? `ws://127.0.0.1:8000/ws/chat/`
    : `wss://${new URL(PROD_BACKEND).host}/ws/chat/`;

// ==========================
// Exports
// ==========================
export { API_BASE_URL, WS_BASE_URL };
