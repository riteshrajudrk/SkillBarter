import { io } from "socket.io-client";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
const socketUrl = apiUrl.replace(/\/api\/v1\/?$/, "");

let socket;

export const getSocket = () => {
  const token = localStorage.getItem("skillbarter-token");

  if (!token) {
    return null;
  }

  if (!socket) {
    socket = io(socketUrl, {
      autoConnect: false,
      auth: { token }
    });
  } else {
    socket.auth = { token };
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
