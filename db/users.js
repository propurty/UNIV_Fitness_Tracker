const client = require("./client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

// user functions
// make sure to hash the password before storing it to the database
async function createUser({ username, password }) {
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users(username, password)
      VALUES($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
    `,
      [username, hashedPassword]
    );

    delete user.password;
    return user;
  } catch (error) {
    console.error("Error in createUser");
    throw error;
  }
}

// ! Make passwordsMatch a let variable so we can change it.
// ! Make an else statement for when not matching.
async function getUser({ username, password }) {
  const user = await getUserByUsername(username);
  const hashedPassword = user.password;
  let passwordsMatch = await bcrypt.compare(password, hashedPassword);

  if (passwordsMatch) {
    delete user["password"];
    return user;
  } else {
    console.error("Passwords do not match");
  }
}

// getUserById(id)
// select a user using the user's ID. Return the user object.
// do NOT return the password

async function getUserById(id) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE id=$1;
    `,
      [id]
    );

    delete user.password;
    return user;
  } catch (error) {
    console.error("Error in getUserById");
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username=$1;
    `,
      [username]
    );

    return user;
  } catch (error) {
    console.error("Error in getUserByUsername");
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
