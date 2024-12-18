import express from "express";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import AccountRoutes from "./routes/AccountRoutes.js";
const app = express();
app.use(bodyParser.json());
dotenv.config();
const PORT = process.env.PORT;

app.use("/account", AccountRoutes);

app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
