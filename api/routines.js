const express = require("express");
const routinesRouter = express.Router();
const {
  getAllPublicRoutines,
  attachActivitiesToRoutines,
  createRoutine,
  updateRoutine,
  destroyRoutine,
  addActivityToRoutine,
} = require("../db/routines");

// Return a list of public routines, include the activities with them
// GET /api/routines
routinesRouter.get("/api/routines", async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines();
    const routinesWithActivities = await attachActivitiesToRoutines(routines);
    res.send(routinesWithActivities);
  } catch (error) {
    next(error);
  }
});

// Create a new routine
// POST /api/routines
routinesRouter.post("/api/routines", async (req, res, next) => {
  try {
    const { name, goal, isPublic } = req.body;
    const { id: creatorId } = req.user;
    const routine = await createRoutine({ creatorId, isPublic, name, goal });
    res.send(routine);
  } catch (error) {
    next(error);
  }
});

// Update a routine, notably change public/private, the name, or the goal
// Requires logged in user to be the creator of the routine
// PATCH /api/routines/:routineId
routinesRouter.patch("/api/routines/:routineId", async (req, res, next) => {
  try {
    const { routineId } = req.params;
    const { name, goal, isPublic } = req.body;
    const { id: creatorId } = req.user;
    const routine = await updateRoutine({
      id: routineId,
      creatorId,
      name,
      goal,
      isPublic,
    });
    res.send(routine);
  } catch (error) {
    next(error);
  }
});

// Hard delete a routine.
// Make sure to delete all the routineActivities whose routine is the one being deleted.
// Requires logged in user to be the creator of the routine
// DELETE /api/routines/:routineId
routinesRouter.delete("/api/routines/:routineId", async (req, res, next) => {
  try {
    const { routineId } = req.params;
    const { id: creatorId } = req.user;
    const routine = await destroyRoutine(routineId, creatorId);
    res.send(routine);
  } catch (error) {
    next(error);
  }
});

// Attach a single activity to a routine. Prevent duplication on (routineId, activityId) pair.
// POST /api/routines/:routineId/activities
routinesRouter.post(
  "/api/routines/:routineId/activities",
  async (req, res, next) => {
    try {
      const { routineId } = req.params;
      const { activityId, count, duration } = req.body;
      const routineActivity = await addActivityToRoutine({
        routineId,
        activityId,
        count,
        duration,
      });
      res.send(routineActivity);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = routinesRouter;
