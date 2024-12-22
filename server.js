import express from "express";
import bodyParser from "body-parser";
import http from "http";
import { WebSocketServer } from "ws";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import AccountRoutes from "./routes/AccountRoutes.js";
import MessageRoutes from "./routes/MessageRoutes.js";
import PostRoutes from "./routes/PostRoutes.js";
import CommentRoutes from "./routes/CommentRoutes.js";
import FriendRoutes from "./routes/FriendRoutes.js";
import { connectPSQL } from "./utils/psql.js";
const app = express();
app.use(bodyParser.json());
dotenv.config();
const PORT = process.env.PORT;
connectPSQL();

const server = http.createServer(app);
export const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("New client connected");
  console.log(wss.clients);
  ws.send("hi<3");
  // Handle incoming messages from clients
  ws.on("message", (message) => {
    console.log(`Received: ${message}`);

    // Echo the message back to the client
    ws.send(`Hello, you sent -> ${message}`);
  });

  // Handle client disconnection
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

app.use("/account", AccountRoutes);
app.use("/message", MessageRoutes);
app.use("/post", PostRoutes);
app.use("/comment", CommentRoutes);
app.use("/friend", FriendRoutes);
server.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
