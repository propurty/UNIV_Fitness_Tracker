const client = require("./client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

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

async function getUser({ username, password }) {
  try {
    const user = await getUserByUsername(username);
    if (user) {
      const hashedPassword = user.password;
      const passwordsMatch = await bcrypt.compare(password, hashedPassword);
      if (passwordsMatch) {
        delete user.password;
        return user;
      }
    }
    return null;
  } catch (error) {
    console.error("Error in getUser");
    throw error;
  }
}

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
