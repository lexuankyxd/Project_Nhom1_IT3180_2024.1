import express from "express";
import {
  insertAccountToPSQL,
  checkIfAccountExists,
  findUserByProfileId,
  checkIfPostExists,
  insertCommentToPSQL,
  getAccount,
} from "../utils/psql.js";
import { createProfile, deleteProfile } from "../utils/mongodb_panc.js";
import jwt from "jsonwebtoken";
import { protect } from "../utils/authenticator.js";

const router = express.Router();

router.post("/addComment", protect, async (req, res) => {
  const { post_id, content } = req.body;
  try {
    // check for null
    if (post_id == undefined || content == undefined)
      return res
        .status(404)
        .json({ message: "The request does not contain the required field" });
    // Tìm người nhận từ PostgreSQL
    const user = await getAccount(req.body.account_id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User does not exist or is deleted" });
    }
    const profile_id = user[0].account_id;
    // Tìm post từ PostgreSQL
    const post = await checkIfPostExists(post_id);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post does not exist or is deleted" });
    }
    // Thêm comment vào cơ sở dữ liệu
    const result = await insertCommentToPSQL(profile_id, post_id, content);
    if (result == -1) {
      return res.status(500).json({ message: "Unable to comment" });
    }
    // Thành công
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("Error in post comment API:", error);
    res.status(500).json({
      message: "The server encountered an internal error",
    });
  }
});

// abandoned

// router.post("/addReply", protect, async (req, res) => {
//   const { profile_id, comment_id, reply_comment, content } = req.body;
//   try {
//     // check for null
//     if (
//       profile_id == undefined ||
//       comment_id == undefined ||
//       reply_comment == undefined ||
//       content == undefined
//     )
//       return res
//         .status(404)
//         .json({ message: "The request does not contain the required field" });
//     // Tìm người dùng từ PostgreSQL
//     const user = await findUserByProfileId(profile_id);
//     if (user.length == 0) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User does not exist or is deleted" });
//     }
//     // Tìm comment gốc từ PostgreSQL
//     const root_comment = await findUserById(user_id);
//     if (!root_comment) {
//       return res
//         .status(404)
//         .json({
//           success: false,
//           message: "Root comment does not exist or is deleted",
//         });
//     }
//     // Thêm comment reply vào cơ sở dữ liệu
//     const result = await insertReplyToPSQL(
//       user_id,
//       comment_id,
//       reply_comment,
//       content,
//     );
//     if (!result) {
//       return res
//         .status(500)
//         .json({ success: false, message: "Unable to reply" });
//     }
//     // Thành công
//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.error("Error in post reply API:", error);
//     res
//       .status(500)
//       .json({
//         success: false,
//         message: "The server encountered an internal error",
//       });
//   }
// });
//
// router.get("/likeComment", protect, async (req, res) => {
//   const { user_id, comment_id, post_id } = req.query;
//   try {
//     // Kiểm tra nếu thiếu thông tin đầu vào
//     if (user_id == undefined) {
//       return res.status(400).json({ success: false, message: "Your ID must not be empty" });
//     }
//     if (comment_id == undefined) {
//       return res.status(400).json({ success: false, message: "Comment's ID must not be empty" });
//     }
//     if (post_id == undefined) {
//       return res.status(400).json({ success: false, message: "Post's ID must not be empty" });
//     }
//     // Tìm người dùng từ PostgreSQL
//     const user = await findUserById(user_id);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User does not exist or is deleted" });
//     }
//     // Tìm post từ PostgreSQL
//     const post = await findPostById(post_id);
//     if (!post) {
//       return res.status(404).json({ success: false, message: "Post does not exist or is deleted" });
//     }
//     // Tìm comment từ PostgreSQL
//     const comment = await findCommentById(comment_id);
//     if (!comment) {
//       return res.status(404).json({ success: false, message: "Comment does not exist or is deleted" });
//     }
//     // Cập nhật trạng thái like vào cơ sở dữ liệu
//     const result = await insertLikeCommentStatus(user_id, post_id, comment_id);
//     if (!result) {
//       return res.status(500).json({ success: false, message: "Unable to like comment" });
//     }
//     // Thành công
//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.error("Error in like comment API:", error);
//     res.status(500).json({ success: false, message: "The server encountered an internal error" });
//   }
// });
// // UNLIKE COMMENT
// router.get("/unlikeComment", protect, async (req, res) => {
//   const { user_id, comment_id, post_id } = req.query;
//   try {
//     // Kiểm tra nếu thiếu thông tin đầu vào
//     if (user_id == undefined) {
//       return res.status(400).json({ success: false, message: "Your ID must not be empty" });
//     }
//     if (comment_id == undefined) {
//       return res.status(400).json({ success: false, message: "Comment's ID must not be empty" });
//     }
//     if (post_id == undefined) {
//       return res.status(400).json({ success: false, message: "Post's ID must not be empty" });
//     }
//     // Tìm người dùng từ PostgreSQL
//     const user = await findUserById(user_id);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User does not exist or is deleted" });
//     }
//     // Tìm post từ PostgreSQL
//     const post = await findPostById(post_id);
//     if (!post) {
//       return res.status(404).json({ success: false, message: "Post does not exist or is deleted" });
//     }
//     // Tìm comment từ PostgreSQL
//     const comment = await findCommentById(comment_id);
//     if (!comment) {
//       return res.status(404).json({ success: false, message: "Comment does not exist or is deleted" });
//     }
//     // Cập nhật trạng thái like vào cơ sở dữ liệu
//     const result = await insertUnlikeCommentStatus(user_id, post_id, comment_id);
//     if (!result) {
//       return res.status(500).json({ success: false, message: "Unable to unlike comment" });
//     }
//     // Thành công
//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.error("Error in unlike comment API:", error);
//     res.status(500).json({ success: false, message: "The server encountered an internal error" });
//   }
// });

export default router;
