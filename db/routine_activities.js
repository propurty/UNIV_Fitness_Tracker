const client = require("./client");

async function getRoutineActivityById(id) {
  try {
    console.log("Got routines!")

    await client.query(`
    
    `)

  }catch (error) {
    console.log("error getting activites");
    throw error;
  }
  return id
}

async function addActivityToRoutine({routineId, activityId, count, duration, sets}) {

    const { rows } = await client.query(`
      INSERT INTO routine_activities (routineId, activityId, count, duration, sets)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `,
     [routineId, activityId, count, duration, sets]
    );
    return rows
}

async function getRoutineActivitiesByRoutine({ id }) {}


async function updateRoutineActivity({ id, ...fields }) {}

async function destroyRoutineActivity(id) {}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  client,
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
