const client = require("./client");

async function getRoutineActivityById(id) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
      SELECT *
      FROM routine_activities
      WHERE id=$1;
    `,
      [id]
    );
    return routine_activity;
  } catch (error) {
    console.error("Error in getRoutineActivityById");
    throw error;
  }
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
      INSERT INTO routine_activities("routineId", "activityId", count, duration)
      VALUES($1, $2, $3, $4)
      RETURNING *;
    `,
      [routineId, activityId, count, duration]
    );
    return routine_activity;
  } catch (error) {
    console.error("Error in addActivityToRoutine");
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: routine_activities } = await client.query(
      `
      SELECT *
      FROM routine_activities
      WHERE "routineId"=$1;
    `,
      [id]
    );
    return routine_activities;
  } catch (error) {
    console.error("Error in getRoutineActivitiesByRoutine");
    throw error;
  }
}

async function updateRoutineActivity({ count, duration, id }) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
      UPDATE routine_activities
      SET count=$1, duration=$2
      WHERE id=$3
      RETURNING *;
    `,
      [count, duration, id]
    );
    return routine_activity;
  } catch (error) {
    console.error("Error in updateRoutineActivity");
    throw error;
  }
}

async function destroyRoutineActivity(id) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
    DELETE FROM routine_activities
    WHERE id=$1
    RETURNING *;
`,
      [id]
    );
    return routine_activity;
  } catch (error) {
    console.error("Error in destroyRoutineActivity");
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    const { rows: users } = await client.query(`
    SELECT * FROM users
    INNER JOIN routines
    ON ${userId} = routines."creatorId"
    INNER JOIN routine_activities
    ON routines.id = routine_activities."routineId"
  `);

    return users[0] ? true : false;
  } catch (error) {
    console.log("Error in canEditRoutineActivity");
    throw error;
  }
}

module.exports = {
  client,
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
