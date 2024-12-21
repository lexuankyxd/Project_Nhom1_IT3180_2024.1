import pg from "pg";
const { Client, Pool } = pg;
const client = new Client({
  host: "localhost",
  user: "postgres",
  password: "admin",
  port: "5432",
  database: "panc",
});
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

export async function insertAccountToPSQL(
  pnumber,
  email,
  password,
  user_profile,
  username,
) {
  try {
    await client.query(account_insert, [
      pnumber,
      email,
      password,
      user_profile,
      username,
    ]);
    return 0;
  } catch (error) {
    console.log("Account insertion failed", error);

    switch (error.constraint) {
      case "unique_phonenumber":
        return 1;
      case "unique_email":
        return 2;
      case "unique_username":
        return 3;
      default:
        return null; // or any other default action you want to take
    }
  }
}

export async function retrieveLoginDetails(login) {
  const res = await client.query(
    "select account_id, username, email, phone_number, password_hash from account where username = $1 or email = $1 or phone_number = $1",
    [login],
  );
  return res.rows;
}

export async function getAccount(account_id) {
  const res = await client.query(
    "select account_id from account where account_id = $1",
    [account_id],
  );
  return res.rows;
}

export async function checkIfAccountExists(account_id) {
  const res = await client.query(
    "select account_id from account where account_id = $1",
    [account_id],
  );
  return res.rows.length != 0;
}

export async function findUserByProfileId(user_profile) {
  const res = await client.query(
    "select account_id, username, email, phone_number from account where user_profile = $1",
    [user_profile],
  );
  return res.rows;
}

export async function checkIfProfileExists(profile_id) {
  const res = await client.query(
    "select * from account where user_profile = $1",
    [profile_id],
  );
  return res.rows.length != 0;
}

export async function addFriend(sender_id, receiver_id) {
  try {
    await client.query("BEGIN");
    const insertQuery = `
      INSERT INTO friend_request (sender, receiver)
      VALUES ($1, $2)
      ON CONFLICT (sender, receiver) DO NOTHING
    `;
    await client.query(insertQuery, [sender_id, receiver_id]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error adding friend:", error);
  }
}

export async function acceptFriend(sender_id, receiver_id) {
  try {
    await client.query("BEGIN");
    const res = await client.query(
      "select * from friend_request where sender = $1 and receiver = $2;",
      [sender_id, receiver_id],
    );
    if (res.rows.length == 0) return -1;
    await client.query(
      "delete from friend_request where sender = $1 and receiver = $2;",
      [sender_id, receiver_id],
    );
    var u1, u2;
    if (sender_id == receiver_id) return -1;
    else if (sender_id < receiver_id) (u1 = receiver_id), (u2 = sender_id);
    else (u1 = sender_id), (u2 = receiver_id);

    await client.query(
      "insert into friend (user1, user2) values ($1, $2) on conflict (user1, user2) do nothing;",
      [u1, u2],
    );
  } catch (error) {
    await client.query("ROLLBACK");
    console.log("Error accepting friend request:", error);
    return -1;
  }
}

export async function rejectFriend(sender_id, receiver_id) {
  try {
    await client.query("BEGIN");
    const deleteQuery = `
      DELETE FROM friend_request
      WHERE (sender_id = $1 AND receiver_id = $2);`;
    await client.query(deleteQuery, [sender_id, receiver_id]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error removing friend relationship:", error);
    return -1;
  }
}

export async function removeFriendRequest(sender_id, receiver_id) {
  try {
    await client.query("BEGIN");
    var u1, u2;
    if (sender_id == receiver_id) return -1;
    else if (sender_id < receiver_id) (u1 = receiver_id), (u2 = sender_id);
    else (u1 = sender_id), (u2 = receiver_id);
    const deleteQuery = `
      DELETE FROM friend
      WHERE (user1 = $1 AND user2 = $2);`;
    await client.query(deleteQuery, [u1, u2]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error removing friend relationship:", error);
    return -1;
  }
}

export async function checkIfIsFriend(user1, user2) {
  try {
    var u1, u2;
    if (user1 == user2) return -1;
    else if (user1 < user2) (u1 = user2), (u2 = user2);
    else (u1 = user1), (u2 = user2);

    const res = await client.query(
      "select * from friend where user1 = $1 and user2 = $2",
      [u1, u2],
    );
    return res.rows.length != 0;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function checkIfPostExists(post_id) {
  try {
    const res = await client.query("select * from post where post_id = $1", [
      post_id,
    ]);
    return res.rows.length != 0;
  } catch (err) {
    console.log(error);
  }
}

export async function insertMessageToPSQL(
  sender_profile_id,
  receiver_profile_id,
  content,
) {
  try {
    await client.query("BEGIN");
    const insertQuery = `
      INSERT INTO public.message (from_user, to_user, content)
      VALUES ($1, $2, $3)
    `;
    await client.query(insertQuery, [sender_id, receiver_id, content]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error send message:", error);
  }
}

export async function insertCommentToPSQL(profile_id, post_id, content) {
  try {
    await client.query("BEGIN");
    const commentQuery = `
      insert into comment (profile_id, post_id, content) value ($1, $2, $3)
    `;
    await client.query(commentQuery, [user_id, post_id, content]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error adding comment to psql:", error);
  }
}

export async function insertReplyToPSQL(
  profile_id,
  comment_id,
  reply_comment,
  content,
) {
  try {
    await client.query("BEGIN");
    await client.query(
      `
      insert into comment (profile_id, post_id, reply_comment, content) value ($1, $2, $3)
    `,
      [profile_id, comment_id, reply_comment, content],
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error reply comment:", error);
  } finally {
    client.release();
  }
}

export async function likePost(profile_id, post_id) {
  try {
    await client.query("BEGIN");
    const res = await client.query(
      "select * from liked where profile_id = $1 and post_id = $2",
      [profile_id, post_id],
    );
    if (res.rows.length != 0) {
      await client.query("rollback");
      return -1;
    }
    const likeQuery = `
      UPDATE post
      SET like_count = like_count + 1
      WHERE post_id = $1;
    `;

    await client.query(
      "insert into liked (profile_id, post_id) value ($1, $2);",
      [profile_id, post_id],
    );

    await client.query(likeQuery, [post_id]);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error like post:", error);
  }
}

export async function unlikePost(profile_id, post_id) {
  try {
    await client.query("BEGIN");
    const res = await client.query(
      "select * from liked where profile_id = $1 and post_id = $2",
      [profile_id, post_id],
    );
    if (res.rows.length == 0) {
      await client.query("rollback");
      return -1;
    }
    const likeQuery = `
      UPDATE post
      SET like_count = like_count - 1
      WHERE post_id = $1;
    `;

    await client.query(
      "delete from liked where profile_id = $1, post_id = $2;",
      [profile_id, post_id],
    );

    await client.query(likeQuery, [post_id]);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error like post:", error);
  }
}

export async function getPost(post_id) {
  try {
    const res = await client.query("select * from post where post_id = $1", [
      post_id,
    ]);
    return res.rows[0];
  } catch (err) {
    console.log("error", err);
  }
}

export async function getPosts() {
  try {
    const res = await client.query("select * from post limit 100");
    return res.rows;
  } catch (err) {
    console.log(err);
  }
}

export async function getAccountPost(profile_id) {
  try {
    const res = await client.query("select * from post where profile_id = $1", [
      profile_id,
    ]);
    return res.rows;
  } catch (error) {
    console.log(error);
  }
}

export async function getAndDeleteAllMessage(profile_id) {
  try {
    await client.query("begin");
    const messages = await client.query(
      "select * from message where from_user = $1 or to_user = $1;",
      [profile_id],
    );
    await client.query(
      "delete from message where from_user = $1 or to_user = $1",
      [profile_id],
    );
    return messages.rows;
  } catch (error) {
    await client.query("rollback");
    console.log(error);
  }
}

export async function getAllFriends(profile_id) {
  try {
    const friends = (
      await client.query(
        "select * from friend where user1 = $1 or user2 = $1",
        [profile_id],
      )
    ).rows;
    return friends;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllFriendRequests(profile_id) {
  try {
    const friend_reqs = (
      await client.query("select * from friend_request where receiver = $1", [
        profile_id,
      ])
    ).rows;
    return friend_reqs;
  } catch (error) {
    console.log(error);
  }
}

export async function connectPSQL() {
  await client.connect();
}

export async function disconnectPSQL() {
  await client.end();
}
