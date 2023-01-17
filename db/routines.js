const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");

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

    return !routine ? null : routine;
  } catch (error) {
    console.error("Error in getRoutineById");
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  const { rows } = await client.query(`
      SELECT *
      FROM routines;
    `);
  return rows;
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(
      `
      SELECT DISTINCT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId"=users.id;
    `
    );

    const allRoutines = await attachActivitiesToRoutines(routines);

    return allRoutines;
  } catch (error) {
    console.error("Error in getAllRoutines");
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId"=users.id
      WHERE users.username=$1 AND routines."creatorId"=users.id
    `,
      [username]
    );

    const allRoutines = await attachActivitiesToRoutines(routines);

    return allRoutines;
  } catch (error) {
    console.error("Error in getAllRoutinesByUser");
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId"=users.id
      WHERE users.username=$1 AND routines."isPublic"=true AND routines."creatorId"=users.id;
    `,
      [username]
    );

    const publicRoutines = await attachActivitiesToRoutines(routines);

    return publicRoutines;
  } catch (error) {
    console.error("Error in getPublicRoutinesByUser");
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId"=users.id
      WHERE routines."isPublic"=true;
    `
    );

    const publicRoutines = await attachActivitiesToRoutines(routines);

    return publicRoutines;
  } catch (error) {
    console.error("Error in getAllPublicRoutines");
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: routines } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId"=users.id
      JOIN routine_activities ON routines.id=routine_activities."routineId"
      WHERE routines."isPublic"=true
      AND routine_activities."activityId"=$1;
    `,
      [id]
    );

    const publicRoutines = await attachActivitiesToRoutines(routines);

    return publicRoutines;
  } catch (error) {
    console.error("Error in getPublicRoutinesByActivity");
    throw error;
  }
}

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

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [routine],
    } = await client.query(
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
