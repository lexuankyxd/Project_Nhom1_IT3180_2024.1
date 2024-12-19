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

export async function connectPSQL() {
  await client.connect();
}

export async function disconnectPSQL() {
  await client.end();
}
