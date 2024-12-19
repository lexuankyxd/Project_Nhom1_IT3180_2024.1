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
router.post("/register", upload.single("img"), async (req, res) => {
  const { username, password, phone_number, email, name, city, bio } = req.body;
  try {
    // check for null
    if (
      req.file == undefined ||
      username == undefined ||
      password == undefined ||
      phone_number == undefined ||
      email == undefined ||
      name == undefined ||
      city == undefined ||
      bio == undefined
    )
      return res
        .status(404)
        .json({ message: "The request does not contain the required field" });
    // upload image to s3 bucket and retrieving the key of the image
    key = await uploadToBucket(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetyppe,
    );
    if (key == null) {
      res
        .status(500)
        .json({ message: "The server encountered internal error" });
    }
    // turn image to a link to that image
    key = CLOUDFRONT_DIST + key;
    // upload profile to mongodb
    profile = await createProfile(name, city, bio, key);
    if (profile == null) {
      res
        .status(500)
        .json({ message: "The server encountered internal error" });
    }
    // push to psql database
    const tmp = await insertAccountToPSQL(
      phone_number,
      email,
      await hashPassword(password),
      profile._id.toString(),
      username,
    );
    switch (tmp) {
      case null:
        return res
          .status(500)
          .json({ message: "The server encountered internal error" });
      case 1:
        return res
          .status(400)
          .json({ message: "This phone number is already used" });
      case 2:
        return res.status(400).json({ message: "This email is already used" });
      case 3:
        return res
          .status(400)
          .json({ message: "This username is already used" });
      case 0:
        break;
    }

    res.status(200).json({ message: "Registration succeeded" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "The server encountered internal error" });
  }
});

router.get("/login", async (req, res) => {
  const { login, password } = req.query;
  if (login == undefined) {
    return res.status(400).json({ message: "Account name must not be empty" });
  } else if (password == undefined) {
    return res.status(400).json({ message: "Password must not be empty" });
  }
  try {
    const result = await retrieveLoginDetails(login);
    if (result == undefined || result.length == 0)
      return res.status(400).json("Account not found in database");
    if (await verifyPassword(password, result[0].password_hash)) {
      const token = jwt.sign(
        {
          account_id: result[0].account_id,
          random: randomBytes(256).toString("base64"),
        },
        JWT_SECRET_KEY,
        { expiresIn: "2w" },
      );
      return res.status(200).json({ token });
    }
    res.status(400).json({ message: "Incorrect password" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "The server encounter internal error" });
  }
});

router.get("/renewToken", protect, async (req, res) => {
  const { account_id } = req.body;
  if (!checkIfAccountExists(account_id))
    return res
      .status(400)
      .json({ message: "Account doesn't exist or account deleted" });
  res.status(200).json({ token: "hi" });
});




// Search User

router.get("/getUserProfile", protect, async (req, res) => {
  const _id = req.query;
  try {
    // Kiểm tra nếu thiếu thông tin đầu vào
    if (_id == undefined) {
      return res.status(400).json({ message: "Account id must not be empty" });
    }

    // Lấy thông tin hồ sơ người dùng từ MongoDB
    const profile = await getProfile(_id);
    if (!profile) {
      return res
        .status(404)
        .json({ message: "Profile with this id doesn't exist" });
    }

    // Trả về thông tin người dùng đích
    res.status(200).json(profile);
  } catch (error) {
    console.error("Error in searchUser API:", error);
    res.status(500).json({ message: "The server encountered internal error" });
  }
});

// Add friend

router.get("/addFen", protect, async (req, res) => {
  const { user_id, friend_id} = req.query;
  try {
    // Kiểm tra nếu thiếu thông tin đầu vào
    if (user_id == undefined) {
      return res.status(400).json({ success: false, message: "Your ID must not be empty" });
    }
    if (friend_id == undefined) {
      return res.status(400).json({ success: false, message: "Friend's ID must not be empty" });
    }

    // Tìm người dùng đích từ PostgreSQL
    const friend = await findUserById(friend_id);
    if (!friend) {
      return res.status(404).json({ success: false, message: "Friend does not exist or is deleted" });
    }

    // Thêm quan hệ bạn bè vào cơ sở dữ liệu
    const result = await addFriendRelationship(user_id, friend_id);
    if (!result) {
      return res.status(500).json({ success: false, message: "Unable to add friend relationship" });
    }

    // Thành công
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in addFen API:", error);
    res.status(500).json({ success: false, message: "The server encountered an internal error" });
  }
});

// Remove friend

router.get("/removeFen", protect, async (req, res) => {
  const { user_id, friend_id} = req.query;
  try {
    // Kiểm tra nếu thiếu thông tin đầu vào
    if (user_id == undefined) {
      return res.status(400).json({ success: false, message: "Your ID must not be empty" });
    }
    if (friend_id == undefined) {
      return res.status(400).json({ success: false, message: "Friend's ID must not be empty" });
    }

    // Xóa quan hệ bạn bè khỏi cơ sở dữ liệu
    const result = await removeFriendRelationship(user_id, friend_id);
    if (!result) {
      return res.status(500).json({ success: false, message: "Unable to add friend relationship" });
    }

    // Thành công
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in removeFen API:", error);
    res.status(500).json({ success: false, message: "The server encountered an internal error" });
  }
});

export default router;