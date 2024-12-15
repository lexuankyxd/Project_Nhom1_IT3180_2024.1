# Account table

===
CREATE TABLE ACCOUNT (
ACCOUNT_ID BIGINT PRIMARY KEY,
PHONE_NUMBER CHAR(15),
EMAIL VARCHAR(320),
PASSWORD_HASH CHAR(60),
USER_PROFILE CHAR(24),
USERNAME VARCHAR(64)
);
===

- ACCOUNT_ID - BIG INT -- primary key
- PHONE_NUMBER - BIG INT
- EMAIL - VARCHAR 320 (max legal email size)
- PASSWORD_HASH - CHAR 60
  +) brcypt with salt, max 72 character password.
- USER_PROFILE - 12 byte of binary data -> 24 char
  +) This is the id of the profile in the MongoDB.
- USERNAME - VARCHAR 64

# Message table

===
CREATE TABLE MESSAGE (
TO_USER BIGINT,
FROM_USER BIGINT,
CONTENT VARCHAR(500),
SENT_TIME TIMESTAMP default current_timestamp,
CONSTRAINT fk_to_user FOREIGN KEY (TO_USER) REFERENCES ACCOUNT(ACCOUNT_ID),
CONSTRAINT fk_from_user FOREIGN KEY (FROM_USER) REFERENCES ACCOUNT(ACCOUNT_ID)
);
===

- TO_USER - foreign key to account id field, id of message receiver
- FROM_USER - same with to user but of sender
- CONTENT - the message
- SENT_TIME - ...

# Friend

===
CREATE TABLE Friend (
User1_id BIGINT,
User2_id BIGINT,
Timestamp TIME,
PRIMARY KEY (User1_id, User2_id),
FOREIGN KEY (User1_id) REFERENCES Account(Account_id),
FOREIGN KEY (User2_id) REFERENCES Account(Account_id)
);
===

# FRIEND REQUEST

===
CREATE TABLE Friend_request (
Receiver_id BIGINT,
Sender_Id BIGINT,
Timestamp timestamp current_timestamp,
PRIMARY KEY (Receiver_id, Sender_Id),
FOREIGN KEY (Receiver_id) REFERENCES Account(Account_id),
FOREIGN KEY (Sender_Id) REFERENCES Account(Account_id)
);
===

# POST

===
CREATE TABLE Post (
Post_Id BIGINT PRIMARY KEY,
Account_id BIGINT,
Coment_count INT DEFAULT 0,
Like_count INT DEFAULT 0,
Content VARCHAR(200),
Media VARCHAR(100),
Latitude DECIMAL(8, 6),
Longitude DECIMAL(9, 6),
FOREIGN KEY (Account_id) REFERENCES Account(Account_id)
);
===

# SAVED POST

===
CREATE TABLE Saved_Post (
User_id BIGINT,
Post_id BIGINT,
PRIMARY KEY (User_id, Post_id),
FOREIGN KEY (User_id) REFERENCES Account(Account_id),
FOREIGN KEY (Post_id) REFERENCES Post(Post_Id)
);
===

# COMMENT

===
CREATE TABLE Comment (
Comment_id BIGINT PRIMARY KEY,
User_id BIGINT,
Post_id BIGINT,
reply_comment BIGINT,
content VARCHAR(100),
timestamp TIME default current_time,
FOREIGN KEY (User_id) REFERENCES Account(Account_id),
FOREIGN KEY (Post_id) REFERENCES Post(Post_Id),
FOREIGN KEY (reply_comment) REFERENCES Comment(Comment_id)
);
===

# LIKEd

===
CREATE TABLE Liked (
User_id BIGINT,
Post_id BIGINT,
PRIMARY KEY (User_id, Post_id),
FOREIGN KEY (User_id) REFERENCES Account(Account_id),
FOREIGN KEY (Post_id) REFERENCES Post(Post_Id)
);
===

# EVENT

===
CREATE TABLE Event (
Event_id BIGINT PRIMARY KEY,
User_id BIGINT,
Time_created TIMEstamp default current_timestamp,
Time_start TIME,
Time_end TIME,
lat DECIMAL(8, 6),
long DECIMAL(9, 6),
FOREIGN KEY (User_id) REFERENCES Account(Account_id)
);
===
