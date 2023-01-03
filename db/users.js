const client = require("./client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;


// user functions
async function createUser({ username, password }) {
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const { rows: [ user ]} = await client.query(`
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
    `, [username, hashedPassword]);

    delete user.password;
    return user;
  } catch (error) {
    console.log("There was an error creating user")
  }
}

async function getUser({ username, password }) {
  const user = await getUserByUsername(username);
  const hashedPassword = user.password;
  const passwordsMatch = await bcrypt.compare(password, hashedPassword);

  if (passwordsMatch) {
    delete user["password"];
    return user;
  }
}

async function getUserById(userId) {
  try {
    const {rows: [user]} = await client.query(`
      SELECT *
      FROM users
      WHERE id=$1;
    `, [userId]);

    return user;
  } catch (error) {
    console.log("There was an error getting user by ID")
    throw error;
  }
}

async function getUserByUsername(userName) {
  try {
    const {rows: [user]} = await client.query(`
      SELECT *
      FROM users
      WHERE username=$1;
    `, [userName]);

    return user;
  } catch (error) {
    console.log("There was an error getting user by username")
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
