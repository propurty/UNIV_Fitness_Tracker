const client = require("./client");

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      SELECT *
      FROM routines
      WHERE id=$1;
    `,
      [id]
    );

    if (!routine) {
      let error = {
        name: "RoutineNotFoundError",
        message: "Could not find a post with that postId",
      };
      throw error;
    }

    return routine;
  } catch (error) {
    console.error("Error in getRoutineById");
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows: routines } = await client.query(`
      SELECT * FROM routines;
    `);

    return routines;
  } catch (error) {
    console.error("Error in getRoutinesWithoutActivities");
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
      SELECT * FROM routines;
    `);

    return routines;
  } catch (error) {
    console.error("Error in getAllRoutines");
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(
      `
      SELECT * FROM routines
      WHERE "creatorId" = ( SELECT id FROM users WHERE username=$1);
    `,
      [username]
    );

    return routines;
  } catch (error) {
    console.error("Error in getAllRoutinesByUser");
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(
      `
      SELECT * FROM routines
      WHERE "creatorId" = ( SELECT id FROM users WHERE username=$1)
      AND "isPublic"=true;
      `,
      [username]
    );

    return routines;
  } catch (error) {
    console.error("Error in getPublicRoutinesByUser");
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(`
      SELECT * FROM routines
      WHERE "isPublic"=true;
    `);

    return routines;
  } catch (error) {
    console.error("Error in getAllPublicRoutines");
    throw error;
  }
}

// Select and return an array of public routines which have a specific
// activityId in their routine_activities join, include their activities
async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: routines } = await client.query(
      `
      SELECT routines.*
      FROM routines
      JOIN routine_activities ON routines.id=routine_activities."routineId"
      WHERE routine_activities."activityId"=$1
      AND routines."isPublic"=true;
    `,
      [id]
    );

    return routines;
  } catch (error) {
    console.error("Error in getPublicRoutinesByActivity");
    throw error;
  }
}

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows: routine } = await client.query(
      `
      INSERT INTO routines("creatorId", "isPublic", name, goal)
      VALUES($1, $2, $3, $4)
      RETURNING *;
    `,
      [creatorId, isPublic, name, goal]
    );

    return routine;
  } catch (error) {
    console.error("Error in createRoutine");
    throw error;
  }
}

// Find the routine with id equal to the passed in id
// Don't update the routine id, but do update the isPublic status, name, or goal, as necessary
async function updateRoutine({ id, ...fields }) {
  try {
    const setString = Object.keys(fields) // [ 'isPublic', 'name', 'goal' ]
      .map((key, index) => `"${key}"=$${index + 1}`)
      .join(", ");

    if (setString.length === 0) {
      return;
    }

    const { rows: routine } = await client.query(
      `
      UPDATE routines
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return routine;
  } catch (error) {
    console.error("Error in updateRoutine");
    throw error;
  }
}

// Remove routine from database and delete all the routine_activities whose routine is the one being deleted.
async function destroyRoutine(id) {
  try {
    await client.query(
      `
      DELETE FROM routine_activities
      WHERE "routineId"=$1;
    `,
      [id]
    );

    await client.query(
      `
      DELETE FROM routines
      WHERE id=$1;
    `,
      [id]
    );

    return;
  } catch (error) {
    console.error("Error in destroyRoutine");
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
