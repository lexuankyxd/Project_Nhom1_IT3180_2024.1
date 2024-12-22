import express from "express";
import {
  checkIfAccountExists,
  findUserByProfileId,
  findPostById,
  getAccount,
  checkIfPostExists,
  likePost,
  unlikePost,
  savePost,
  unsavePost,
  getAllSavedPost,
  createPost,
} from "../utils/psql.js";
import { upload } from "../utils/receiveImageFromReq.js";
import { uploadToBucket } from "../utils/s3bucket.js";
import { createProfile, deleteProfile } from "../utils/mongodb_panc.js";
import jwt from "jsonwebtoken";
import { protect } from "../utils/authenticator.js";
import dotenv from "dotenv";
dotenv.config();
const CLOUDFRONT_DIST = process.env.CLOUDFRONT_DIST;
const router = express.Router();
router.get("/likePost", protect, async (req, res) => {
  const { post_id } = req.query;
  try {
    // Kiểm tra nếu thiếu thông tin đầu vào
    if (post_id == undefined) {
      return res.status(400).json({ message: "Post's ID must not be empty" });
    }
    // Tìm người dùng từ PostgreSQL
    const user = await getAccount(req.body.account_id);
    if (user.length == 0) {
      return res
        .status(404)
        .json({ message: "User does not exist or is deleted" });
    }
    const profile_id = user[0].user_profile;
    // Tìm post từ PostgreSQL
    const post = await checkIfPostExists(post_id);
    if (post.length == 0) {
      return res
        .status(404)
        .json({ message: "Post does not exist or is deleted" });
    }
    // Cập nhật trạng thái like vào cơ sở dữ liệu
    const result = await likePost(profile_id, post_id);
    if (result == -1) {
      return res.status(500).json({ message: "Unable to like post" });
    }
    // Thành công
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in like post API:", error);
    res.status(500).json({
      message: "The server encountered an internal error",
    });
  }
});
// UNLIKE POST
router.get("/unlikePost", protect, async (req, res) => {
  const { post_id, user_id } = req.query;
  try {
    // Kiểm tra nếu thiếu thông tin đầu vào
    if (post_id == undefined) {
      return res.status(400).json({ message: "Post's ID must not be empty" });
    }
    // Tìm người dùng từ PostgreSQL
    const user = await getAccount(req.body.account_id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User does not exist or is deleted" });
    }
    const profile_id = user[0].user_profile;
    // Tìm post từ PostgreSQL
    const post = await findPostById(post_id);
    if (post.length == 0) {
      return res
        .status(404)
        .json({ message: "Post does not exist or is deleted" });
    }
    // Cập nhật trạng thái like vào cơ sở dữ liệu
    const result = await unlikePost(profile_id, post_id);
    if (result == -1) {
      return res.status(500).json({ message: "Unable to unlike post" });
    }
    // Thành công
    res.status(200).json({ message: "unlike succeeded" });
  } catch (error) {
    console.error("Error in unlike post API:", error);
    res.status(500).json({
      message: "The server encountered an internal error",
    });
  }
});

router.get("/getPost", protect, async (req, res) => {
  const { post_id } = req.query;
  try {
    // Kiểm tra nếu thiếu thông tin đầu vào
    if (post_id == undefined) {
      return res.status(400).json({ message: "Post ID must not be empty" });
    }
    // Tìm post từ PostgreSQL
    const post = await findPostById(post_id);
    if (post.length == 0) {
      return res
        .status(404)
        .json({ success: false, message: "Post does not exist or is deleted" });
    }
    // Trả về thông tin post
    res.status(200).json(post);
  } catch (error) {
    console.error("Error in view post API:", error);
    res.status(500).json({ message: "The server encountered internal error" });
  }
});

router.post("/createPost", upload.single("img"), protect, async (req, res) => {
  const { content, lat, long } = req.body;
  try {
    var key = await uploadToBucket(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
    );

    key = CLOUDFRONT_DIST + key;
    const account = await getAccount(req.body.account_id);
    if (account.length == 0) {
      return res.status(404).json({ message: "Account not found" });
    }
    const r = await createPost(
      account[0].user_profile,
      content,
      key,
      lat,
      long,
    );
    if (r == -1)
      return res.status(500).json({ message: "Internal server error" });
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
});

router.get("/savePost", protect, async (req, res) => {
  const { post_id } = req.query;
  try {
    if (post_id == undefined) {
      return res.status(400).json({ message: "Post ID must not be empty" });
    }
    // Tìm post từ PostgreSQL
    const post = await findPostById(post_id);
    if (post.length == 0) {
      return res
        .status(404)
        .json({ success: false, message: "Post does not exist or is deleted" });
    }

    // Tìm người dùng từ PostgreSQL
    const user = await getAccount(req.body.account_id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User does not exist or is deleted" });
    }
    const profile_id = user[0].user_profile;

    const r = await savePost(post_id, profile_id);
    res.status(200).json({ message: "Saved post" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
});

router.get("/unsavePost", protect, async (req, res) => {
  const { post_id } = req.query;
  try {
    if (post_id == undefined) {
      return res.status(400).json({ message: "Post ID must not be empty" });
    }
    // Tìm post từ PostgreSQL
    const post = await findPostById(post_id);
    if (post.length == 0) {
      return res
        .status(404)
        .json({ success: false, message: "Post does not exist or is deleted" });
    }

    // Tìm người dùng từ PostgreSQL
    const user = await getAccount(req.body.account_id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User does not exist or is deleted" });
    }
    const profile_id = user[0].user_profile;

    const r = await unsavePost(post_id, profile_id);
    res.status(200).json({ message: "Unsaved post" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
});

router.get("/getSavedPost", protect, async (req, res) => {
  try {
    const user = await getAccount(req.body.account_id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User does not exist or is deleted" });
    }
    const profile_id = user[0].user_profile;
    const r = await getAllSavedPost(profile_id);
    res.status(200).json({ savedPosts: r });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
export default router;
