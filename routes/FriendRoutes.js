import {
  addFriend,
  acceptFriend,
  rejectFriend,
  removeFriend,
  checkIfIsFriend,
  getAccount,
  findUserByProfileId,
} from "../utils/psql.js";
import { protect } from "../utils/authenticator.js";
import express from "express";
const router = express.Router();

router.get("/addFriend", protect, async (req, res) => {
  const { receiver } = req.query;
  try {
    if (receiver == undefined) {
      return res.status(404).json({ message: "Must send receiver id" });
    }
    const r = await findUserByProfileId(receiver);
    if (r.length == 0) {
      return res.status(404).json({ message: "Receiver profile not found" });
    }

    const user = await getAccount(req.body.account_id);
    if (user.length == 0) {
      return res.status(404).json({ message: "Sender profile not found" });
    }
    const profile_id = user[0].user_profile;
    const t = await checkIfIsFriend(profile_id, receiver);
    if (t) return res.status(400).json({ message: "Users are already friend" });
    const tmp = await addFriend(profile_id, receiver);
    if (tmp == -1)
      return res.status(400).json({ message: "Error while sending request" });
    res.status(200).json({ message: "Sended friend request" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/acceptFriend", protect, async (req, res) => {
  const { sender } = req.query;
  try {
    if (sender == undefined) {
      return res.status(404).json({ message: "Must send sender id" });
    }
    const r = await findUserByProfileId(sender);
    if (r.length == 0) {
      return res.status(404).json({ message: "Sender profile not found" });
    }

    const user = await getAccount(req.body.account_id);
    if (user.length == 0) {
      return res.status(404).json({ message: "Receiver profile not found" });
    }
    const profile_id = user[0].user_profile;
    const tmp = await acceptFriend(sender, profile_id);
    if (tmp == -1)
      return res.status(400).json({ message: "Error while accepting request" });
    res.status(200).json({ message: "Accepted friend request" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/rejectFriend", protect, async (req, res) => {
  const { sender } = req.query;
  try {
    if (sender == undefined) {
      return res.status(404).json({ message: "Must send sender id" });
    }
    const r = await findUserByProfileId(sender);
    if (r.length == 0) {
      return res.status(404).json({ message: "Sender profile not found" });
    }

    const user = await getAccount(req.body.account_id);
    if (user.length == 0) {
      return res.status(404).json({ message: "Receiver profile not found" });
    }
    const profile_id = user[0].user_profile;
    const tmp = await rejectFriend(sender, profile_id);
    if (tmp == -1)
      return res.status(400).json({ message: "Error while rejecting request" });
    res.status(200).json({ message: "Rejected friend request" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/removeFriend", protect, async (req, res) => {
  const { user2 } = req.query;
  try {
    if (user2 == undefined) {
      return res.status(404).json({ message: "Must send friend profile id" });
    }
    const r = await findUserByProfileId(user2);
    if (r.length == 0) {
      return res.status(404).json({ message: "Friend profile is not found" });
    }

    const user = await getAccount(req.body.account_id);
    if (user.length == 0) {
      return res.status(404).json({ message: "Your profile not found" });
    }
    const user1 = user[0].user_profile;
    const tmp = await removeFriend(user1, user2);
    if (tmp == -1)
      return res.status(400).json({ message: "Error while removing friend" });
    res.status(200).json({ message: "Removed friend" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
