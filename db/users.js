const client = require("./client");
// Here to test if this works
// database functions

// user functions
async function createUser({ username, password }) {}

async function getUser({ username, password }) {}

async function getUserById(userId) {}

async function getUserByUsername(userName) {}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
