import bcrypt from "bcrypt";
const saltRounds = 10;

export async function hashPassword(plainPassword) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    return hashedPassword; // Return the hashed password to store in the database
  } catch (error) {
    console.error("Error hashing password:", error);
  }
}

// checking password hash
export async function verifyPassword(enteredPassword, storedHash) {
  try {
    return await bcrypt.compare(enteredPassword, storedHash);
  } catch (error) {
    console.error("Error verifying password:", error);
  }
}
