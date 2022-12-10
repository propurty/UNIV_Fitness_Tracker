const client = require("./client");

// database functions


// user functions
async function createUser({ username, password }) {
  try {
    const { rows: [ user ]} = await client.query(`
      INSERT INTO users (username, passsword)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING *
    `, [username, password]);

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    const { rows } = await client.query(`
      SELECT id, username, password
      FROM users;
    `, [username, password]);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {rows: [user]} = await client.query(`
      SELECT id, username, name
      FROM users
      WHERE id=${userId}
    `);

    if (!user) {
      return null;
    }
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
