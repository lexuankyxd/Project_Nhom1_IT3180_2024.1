import { faker } from "@faker-js/faker";
import { disconnectPSQL, insertAccountToPSQL } from "./psql.js";
import { hashPassword, verifyPassword } from "./passwordHasher.js";
import { uploadToBucket } from "./s3bucket.js";
import { downloadImageToBuffer } from "./downloadImage.js";
import fs from "fs";
import {
  Profile,
  createProfile,
  updateProfile,
  deleteProfile,
  disconnectMongoDB,
} from "./mongodb_panc.js";

var logins = [];

for (let i = 0; i < 10; i++) {
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

    const prof = await createProfile(
      name,
      faker.location.city(),
      faker.person.bio(),
      key,
      faker.helpers.uniqueArray(
        faker.word.adjective(),
        Math.floor(Math.random() * (5 - 3) + 3),
      ),
    );
    var data = [
      faker.phone.number(),
      faker.internet.email({ firstName, lastName }),
      faker.internet.password(),
      prof._id.toString(),
      faker.internet.username({ firstName, lastName }),
    ];
    logins.push({ username: data[4], password: data[2] });
    data[2] = hashPassword(data[2]);
    insertAccountToPSQL(data[0], data[1], data[2], data[3], data[4]);
    console.log("inserted ", i + 1);
  } catch (error) {
    console.log("error at " + i, error);
  }
}
disconnectPSQL();
disconnectMongoDB();
fs.writeFile("./logins.json", JSON.stringify(logins), (err) => {
  if (err) {
    console.log("err while writing logins file ", err);
  }
});

console.log("fini");
