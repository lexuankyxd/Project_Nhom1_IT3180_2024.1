---
Account table
===
create table ACCOUNT(ACCOUNT_ID bigint NOT NULL PRIMARY KEY, PHONE_NUMBER bigint, EMAIL varchar(320), PASSWORD_HASH char 16, )
===
- ACCOUNT_ID: BIG INT
- PHONE_NUMBER: BIG INT
- EMAIL: VARCHAR 320 (max legal email size)
- PASSWORD_HASH: CHAR 16
  +) Using Argon2id with a minimum configuration of 19 MiB of memory, an iteration count of 2, and 1 degree of parallelism. This produces a hash of 128 bit => 16 byte => 16 char.
- USER_PROFILE: BIG INT 
  +) This is the id of the profile in the MongoDB.
- USERNAME: VARCHAR 64
---
