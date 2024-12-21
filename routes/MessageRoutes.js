import express from "express";
import {
  insertAccountToPSQL,
  checkIfAccountExists,
  insertMessageToPSQL,
  findUserByProfileId,
  getAccount,
} from "../utils/psql.js";
import { createProfile, deleteProfile } from "../utils/mongodb_panc.js";
import jwt from "jsonwebtoken";
import { protect } from "../utils/authenticator.js";

const router = express.Router();

router.post("/sendMessage", protect, async (req, res) => {
  const { receiver_profile_id, message_content } = req.body;
  try {
    // check for null
    if (
      sender_profile_id ||
      receiver_profile_id == undefined ||
      message_content == undefined
    )
      return res
        .status(404)
        .json({ message: "The request does not contain the required field" });
    // Tìm người nhận từ PostgreSQL
    const receiver = await findUserByProfileId(receiver_profile_id);
    if (receiver.length == 0) {
      return res.status(404).json({
        success: false,
        message: "Receiver does not exist or is deleted",
      });
    }
    // Tìm người gửi từ PostgreSQL
    const sender = await getAccount(req.body.account_id);
    if (sender.length == 0) {
      return res.status(404).json({
        success: false,
        message: "Sender does not exist or is deleted ",
      });
    }
    const sender_profile_id = sender[0].user_profile;

    // Thêm tin nhắn vào cơ sở dữ liệu
    const result = await insertMessageToPSQL(
      sender_profile_id,
      receiver_profile_id,
      message_content,
    );
    if (!result) {
      return res
        .status(500)
        .json({ success: false, message: "Unable to send message" });
    }
    // Thành công
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in send message API:", error);
    res.status(500).json({
      success: false,
      message: "The server encountered an internal error",
    });
  }
});

export default router;
