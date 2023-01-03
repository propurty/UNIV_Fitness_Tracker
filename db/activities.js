const client = require("./client");

// database functions
async function getAllActivities() {
  try {
    const { rows } = await client.query(`
      SELECT *
      FROM activities;
    `);
    return rows;
  } catch (error) {
    console.error("Error in getAllActivities");
    throw error;
  }
}

async function getActivityById(id) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
      SELECT *
      FROM activities
      WHERE id=$1;
    `,
      [id]
    );
    return activity;
  } catch (error) {
    console.error("Error in getActivityById");
    throw error;
  }
}

async function getActivityByName(name) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
      SELECT *
      FROM activities
      WHERE name=$1;
    `,
      [name]
    );
    return activity;
  } catch (error) {
    console.error("Error in getActivityByName");
    throw error;
  }
}

// select and return an array of all activities
async function attachActivitiesToRoutines(routines) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
      INSERT INTO activities(routines)
      VALUES $1
      RETURNING *;
    `,
      [routines]
    );
    return activity;
  } catch (error) {
    console.error("Error in attachActivitiesToRoutines");
    throw error;
  }
}

// return the new activity
async function createActivity({ name, description }) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
      INSERT INTO activities(name, description)
      VALUES ($1, $2)
      RETURNING *;
    `,
      [name, description]
    );

    return activity;
  } catch (error) {
    console.error("Error in createActivity");
    throw error;
  }
}

// don't try to update the id
// do update the name and description
// return the updated activity
// Updates name without affecting the ID. Returns the updated Activity.
// Updates description without affecting the ID. Returns the updated Activity.
async function updateActivity({ id, name, description }) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
      UPDATE activities
      SET name=$2, description=$3
      WHERE id=$1
      RETURNING *
    `,
      [id, name, description]
    );

    return activity;
  } catch (error) {
    console.error("Error in updateActivity");
    throw error;
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
