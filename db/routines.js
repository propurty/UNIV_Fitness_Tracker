const client = require("./client");

// return the routine
async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      SELECT * FROM routines WHERE id=$1;
    `,
      [id]
    );
    return routine;
  } catch (error) {
    console.error("Error in getRoutineById");
    throw error;
  }
}

// select and return an array of all routines without any activities
// should not include a routine more than once
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

// Should include the public routine
// Should include the private routine
// includes their activities
// should not include a routine more than once
// includes username, from users join, aliased as creatorName
// includes duration and count on activities, from routine_activities join
// includes the routineId and routineActivityId on activities
// select and return an array of all routines, include their activities
async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName", routine_activities.duration, routine_activities.count, routine_activities.id AS "routineActivityId"
      FROM routines
      JOIN users ON routines."creatorId"=users.id
      JOIN routine_activities ON routines.id=routine_activities."routineId";
    `
    );

    return routines;
  } catch (error) {
    console.error("Error in getAllRoutines");
    throw error;
  }
}

//  should get the public routine for the user
//  should get the private routine for the user
//  should not get routines for another user
//  includes their activities
//  should not include a routine more than once
//  includes username, from users join, aliased as creatorName
//  includes duration and count on activities, from routine_activities join
//  includes the routineId and routineActivityId on activities
//  select and return an array of all routines made by user, include their activities
async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName", routine_activities.duration, routine_activities.count, routine_activities.id AS "routineActivityId"
      FROM routines
      JOIN users ON routines."creatorId"=users.id
      JOIN routine_activities ON routines.id=routine_activities."routineId"
      WHERE users.username=$1;
    `,
      [username]
    );

    return routines;
  } catch (error) {
    console.error("Error in getAllRoutinesByUser");
    throw error;
  }
}

// should include the public routine
// should not contain the private routine
// includes their activities
// should not include a routine more than once
// includes username, from users join, aliased as creatorName
// includes duration and count on activities, from routine_activities join
// includes the routineId and routineActivityId on activities
// select and return an array of public routines made by user, include their activities
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

// should include the public routine
// should not contain the private routine
// includes their activities
// should not include a routine more than once
// includes username, from users join, aliased as creatorName
// includes duration and count on activities, from routine_activities join
// includes the routineId and routineActivityId on activities
// select and return an array of public routines, include their activities
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

// should include the public routine containing a specific activityId
// should not include a public routine containing another activity
// should not contain the private routine for that activityId
// includes their activities
// should not include a routine more than once
// includes username, from users join, aliased as creatorName
// includes duration and count on activities, from routine_activities join
// includes the routineId and routineActivityId on activities
// Select and return an array of public routines which have a specific
// activityId in their routine_activities join, include their activities
async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: routines } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName", routine_activities.duration, routine_activities.count, routine_activities.id AS "routineActivityId"
      FROM routines
      JOIN users ON routines."creatorId"=users.id
      JOIN routine_activities ON routines.id=routine_activities."routineId"
      WHERE routines."isPublic"=true
      AND routine_activities."activityId"=$1;
    `,
      [id]
    );

    return routines;
  } catch (error) {
    console.error("Error in getPublicRoutinesByActivity");
    throw error;
  }
}

// create and return the new routine
async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
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
// Updates the public status, name, or goal, as necessary
// Does not update fields that are not passed in
// Returns the updated routine
async function updateRoutine({ id, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      UPDATE routines
      SET "isPublic"=$1, name=$2, goal=$3
      WHERE id=$4
      RETURNING *;
    `,
      [isPublic, name, goal, id]
    );

    return routine;
  } catch (error) {
    console.error("Error in updateRoutine");
    throw error;
  }
}

// Remove routine from database
// Make sure to delete all the routine_activities whose routine is the one being deleted.
// Deletes all the routine_activities whose routine is the one being deleted.
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
