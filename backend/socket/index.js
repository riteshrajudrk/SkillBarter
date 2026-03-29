import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import Message from "../models/Message.js";

const conversationIdFor = (userId, partnerId) =>
  [String(userId), String(partnerId)].sort().join(":");

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: env.clientUrl,
      credentials: true
    }
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, env.jwtSecret);
      socket.userId = decoded.userId;
      next();
    } catch (_error) {
      next(new Error("Unauthorized socket"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(socket.userId);

    socket.on("chat:join", ({ partnerId }) => {
      socket.join(conversationIdFor(socket.userId, partnerId));
    });

    socket.on("chat:typing", ({ partnerId, typing }) => {
      io.to(partnerId).emit("chat:typing", {
        userId: socket.userId,
        typing
      });
    });

    socket.on("chat:send", async ({ receiver, message }) => {
      const conversationId = conversationIdFor(socket.userId, receiver);
      const savedMessage = await Message.create({
        conversationId,
        sender: socket.userId,
        receiver,
        message
      });

      io.to(conversationId).emit("chat:message", savedMessage);
      io.to(receiver).emit("chat:message", savedMessage);
    });

    socket.on("chat:read", async ({ partnerId }) => {
      const conversationId = conversationIdFor(socket.userId, partnerId);
      await Message.updateMany(
        { conversationId, receiver: socket.userId, readAt: null },
        { readAt: new Date() }
      );

      io.to(partnerId).emit("chat:read", {
        conversationId,
        readerId: socket.userId
      });
    });
  });

  return io;
};
