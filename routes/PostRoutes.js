import express from "express";
import {
  checkIfAccountExists,
  findUserByProfileId,
  getAccount,
  checkIfPostExists,
} from "../utils/psql.js";
import { createProfile, deleteProfile } from "../utils/mongodb_panc.js";
import jwt from "jsonwebtoken";
import { protect } from "../utils/authenticator.js";

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
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post does not exist or is deleted" });
    }
    // Cập nhật trạng thái like vào cơ sở dữ liệu
    const result = await insertLikePostStatus(profile_id, post_id);
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
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post does not exist or is deleted" });
    }
    // Cập nhật trạng thái like vào cơ sở dữ liệu
    const result = await insertUnlikePostStatus(user_profile, post_id);
    if (!result) {
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
    if (user_id == undefined) {
      return res.status(400).json({ message: "Account ID must not be empty" });
    }
    if (post_id == undefined) {
      return res.status(400).json({ message: "Post ID must not be empty" });
    }
    // Tìm người dùng từ PostgreSQL
    const user = await findUserById(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist or is deleted" });
    }
    // Tìm post từ PostgreSQL
    const post = await findPostById(post_id);
    if (!post) {
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

router.post("/createPost", protect, async (req, res) => {
  // const {post}
});
