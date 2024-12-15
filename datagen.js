import pg from "pg";
import { faker } from "@faker-js/faker";
import fetch from "node-fetch";
import { uploadToBucket } from "./s3bucket.js";
import bcrypt from "bcrypt";
const saltRounds = 10;
import fs from "fs";
import {
  Profile,
  createProfile,
  updateProfile,
  deleteProfile,
  disconnectMongoDB,
} from "./mongodb_panc.js";
const { Client, Pool } = pg;
const client = new Client({
  host: "localhost",
  user: "postgres",
  password: "admin",
  port: "5432",
  database: "panc",
});
await client.connect();
const account_insert =
  'insert into account ("phone_number", "email", "password_hash", "user_profile", "username") values ($1, $2, $3, $4, $5)';
const comment_insert =
  "insert into comment (user_id, post_id, reply_comment, content) value ($1, $2, $3, $4)";
const event_insert =
  "insert into event (user_id, time_start, time_end, lat, long) value ($1, $2, $3, $4, $5)";
const friend_insert = "insert into event (user1_id, user2_id) value ($1, $2)";
const friend_request_insert =
  "insert into friend_request (receiver_id, sender_id) value ($1, $2)";
const liked_insert = "insert into liked (user_id, post_id) value ($1, $2)";
const message_insert =
  "insert into message (to_user, front_user, content) value ($1, $2, $3)";
const post_insert =
  "insert into post (account_id, comment_count, like_count, content, media, latitude, longitude) value ($1, $2, $3, $4, $5, $6, $7)";

// grab image from link and upload to bucket
async function downloadImageToBuffer(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get Content-Type
    const contentType = response.headers.get("content-type");

    // Get Content-Disposition
    const contentDisposition = response.headers.get("content-disposition");
    let filename = "unknown";

    if (contentDisposition && contentDisposition.indexOf("attachment") !== -1) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
        contentDisposition,
      );
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, ""); // Remove quotes if present
      }
    }
    const type = contentType.split("/")[1];

    // You can also read the file data as a buffer if needed
    const buffer = await response.arrayBuffer();
    return { buffer, filename, type };
  } catch (error) {
    console.error("Error downloading file:", error);
  }
}

// hashing password
async function hashPassword(plainPassword) {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    return hashedPassword; // Return the hashed password to store in the database
  } catch (error) {
    console.error("Error hashing password:", error);
  }
}

// checking password hash
async function verifyPassword(enteredPassword, storedHash) {
  try {
    const match = await bcrypt.compare(enteredPassword, storedHash);
    if (match) {
      console.log("Password is valid!");
      // Proceed with login or further actions
    } else {
      console.log("Invalid password!");
      // Handle invalid login attempt
    }
  } catch (error) {
    console.error("Error verifying password:", error);
  }
}

var logins = [];

// generate random user
for (let i = 0; i < 2000; i++) {
  try {
    // generate random profile
    const name = faker.person.fullName();
    const firstName = name.split(" ")[0];
    const lastName = name.split(" ")[1];
    var result;
    await downloadImageToBuffer(faker.image.url())
      .then((res) => {
        result = res;
      })
      .catch((err) => {
        console.log("err", err);
      });
    const key = await uploadToBucket(
      result.buffer,
      result.filename,
      result.type,
    );
    const prof = new Profile({
      name: name,
      city: faker.location.city(),
      description: faker.person.bio(),
      imageId: key,
      profileTages: faker.helpers.uniqueArray(
        faker.word.adjective(),
        Math.floor(Math.random() * (5 - 3) + 3),
      ),
    });
    const saved_prf = await prof.save();

    var data = [
      faker.phone.number(),
      faker.internet.email({ firstName, lastName }),
      faker.internet.password(),
      saved_prf._id.toString(),
      faker.internet.username({ firstName, lastName }),
    ];
    logins.push([data[4], data[2]]);
    data[2] = hashPassword(data[2]);

    await client.query(account_insert, data);
    console.log("inserted ", i + 1);
  } catch (error) {
    console.log("error at " + i, error);
  }
}
await client.end();
disconnectMongoDB();
fs.writeFile("./logins.csv", logins.toString(), (err) => {
  if (err) {
    console.log("err while writing logins file ", err);
  }
});
console.log("fini");
