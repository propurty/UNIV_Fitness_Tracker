const client = require("./client");
const bcrypt = require("bcrypt");


// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const { rows: [ user ]} = await client.query(`
      INSERT INTO users (username, passsword)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING *
    `, [username, password]);

    delete user.password;
    return user;
  } catch (error) {
    throw error;
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
      WHERE id = $1;
    `, [id]);

    return user;
  } catch (error) {
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
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
