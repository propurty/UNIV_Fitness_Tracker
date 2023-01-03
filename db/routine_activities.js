const client = require("./client");

// return the routine_activity
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

// TODO create a new routine_activity, and return it
// creates a new routine_activity, and returns it
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

// ! select and return an array of all routine_activity records
// Should return the routine activities for a routine.
async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
      SELECT *
      FROM routine_activities
      WHERE "routineId"=$1;
    `,
      [id]
    );
    return routine_activity;
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

//async function canEditRoutineActivity(routineActivityId, userId) {
// const { rows:[routine_activity] } = await client.query (`

// `)
//}

module.exports = {
  client,
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
