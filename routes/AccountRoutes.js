import express from "express";
import bodyParser from "body-parser";
import { hashPassword, verifyPassword } from "../utils/passwordHasher.js";
import { insertAccountToPSQL } from "../utils/psql.js";
import { createProfile, deleteProfile } from "../utils/mongodb_panc.js";
import { upload } from "../utils/receiveImageFromReq.js";
import { uploadToBucket, deleteFromBucket } from "../utils/s3bucket.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const CLOUDFRONT_DIST = process.env.CLOUDFRONT_DIST;
var key;
var profile;
router.post("/register", upload.single("img"), async (req, res) => {
  const { username, password, phone_number, email, name, city, bio } = req.body;
  try {
    // upload image to s3 bucket and retrieving the key of the image
    key = await uploadToBucket(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetyppe,
    );
    // turn image to a link to that image
    key = CLOUDFRONT_DIST + key;
    // upload profile to mongodb
    profile = await createProfile(name, city, bio, key);
    // push to psql database
    insertAccountToPSQL(
      phone_number,
      email,
      hashPassword(password),
      profile._id.toString(),
      username,
    );
    res.status(200).json({ message: "Registration succeeded" });
  } catch (error) {
    if (error.message == "bucket uplaod error") {
    } else if (error.message == "mongo upload error") {
      deleteFromBucket(key.substring(CLOUDFRONT_DIST.length));
    } else if (error.message == "psql error") {
      deleteFromBucket(key.substring(CLOUDFRONT_DIST.length));
      deleteProfile(profile._id.toString());
    }
    res.status(500).json({ message: "The server encountered internal error" });
  }
});

export default router;
