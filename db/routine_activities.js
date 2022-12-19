const client = require("./client");

async function getRoutineActivityById(id) {
  try {
    const { rows:[routine_activity] } = await client.query (`
      SELECT *
      FROM routine_activities
      WHERE id=$1;
    `, [id]);
    return routine_activity;
  } catch (error) {
    console.error("Error in getRoutineActivityById")
    throw(error)
  }
  }

async function addActivityToRoutine({routineId, activityId, count, duration}) {

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

    const { rows:[routine_activity] } = await client.query (`
      SELECT *
      FROM routine_activities
      WHERE id=$1;
    `, [id]);
    return routine_activity;
}


async function updateRoutineActivity({count, duration, id}) {
  
    const { rows:[routine_activity] } = await client.query (`
      UPDATE routine_activities
      SET count=$1, duration=$2
      WHERE id=$3
      RETURNING *;
    `, [count, duration, id]);
    return routine_activity;
}

async function destroyRoutineActivity(id) {
  const { rows:[routine_activity] } = await client.query (`
    DELETE FROM routine_activities
    WHERE id=$1
    RETURNING *;
`, [id])
  return routine_activity
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
  //canEditRoutineActivity,
};
