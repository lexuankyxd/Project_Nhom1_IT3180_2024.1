import express from "express";
import bodyParser from "body-parser";
import { hashPassword, verifyPassword } from "../utils/passwordHasher.js";
import { insertAccountToPSQL, checkIfAccountExists } from "../utils/psql.js";
import { createProfile, deleteProfile } from "../utils/mongodb_panc.js";
import { upload } from "../utils/receiveImageFromReq.js";
import { uploadToBucket, deleteFromBucket } from "../utils/s3bucket.js";
import { retrieveLoginDetails } from "../utils/psql.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { protect } from "../utils/authenticator.js";
dotenv.config();

const router = express.Router();
const CLOUDFRONT_DIST = process.env.CLOUDFRONT_DIST;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
var key;
var profile;


router.post("/sendMessage", async (req, res) => {
  const { sender_id, receiver_id, message_content } = req.body;
  try {
    // check for null
    if (
        sender_id == undefined ||
        receiver_id == undefined ||
        message_content == undefined
    )
      return res
        .status(404)
        .json({ message: "The request does not contain the required field" });

    // Tìm người nhận từ PostgreSQL
    const receiver = await findUserById(receiver_id);
    if (!receiver) {
      return res.status(404).json({ success: false, message: "Receiver does not exist or is deleted" });
    }

    // Tìm người gửi từ PostgreSQL
    const sender = await findUserById(sender_id);
    if (!sender) {
      return res.status(404).json({ success: false, message: "Sender does not exist or is deleted" });
    }

    // Thêm tin nhắn vào cơ sở dữ liệu
    const result = await insertMessageToPSQL(
        sender_id,
        receiver_id,
        message_content
    );
    if (!result) {
      return res.status(500).json({ success: false, message: "Unable to send message" });
    }
    // Thành công
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in send message API:", error);
    res.status(500).json({ success: false, message: "The server encountered an internal error" });
  }
});



export default router;