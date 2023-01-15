const express = require("express");
const routinesRouter = express.Router();
const {
  createRoutine,
  getRoutineById,
  getAllRoutines,
  updateRoutine,
  destroyRoutine,
  addActivityToRoutine,
} = require("../db");

// GET /api/routines
routinesRouter.get("/", async (req, res) => {
  const allRoutines = await getAllRoutines();
  res.send(allRoutines);
});

// POST /api/routines
routinesRouter.post("/", async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  const { id } = req.user;
  try {
    const newRoutine = await createRoutine({
      creatorId: id,
      isPublic,
      name,
      goal,
    });
    res.send(newRoutine);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/routines/:routineId
routinesRouter.patch("/:routineId", async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  const id = req.params.routineId;

  try {
    const originalRoutine = await getRoutineById(id);

    if (!originalRoutine) {
      next({
        error: "error",
        name: "NoRoutineFoundError",
        message: `Routine ${id} not found`,
      });
    } else if (req.user && originalRoutine.creatorId !== req.user.id) {
      next(
        res.status(403).send({
          error: "notOwnerOfRoutineError",
          message: `User ${req.user.username} is not the owner of the routine`,
          name: name,
        })
      );
    } else {
      const updatedRoutine = await updateRoutine({
        id,
        isPublic,
        name,
        goal,
      });
      res.send(updatedRoutine);
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/routines/:routineId
routinesRouter.delete("/:routineId", async (req, res, next) => {
  try {
    const { routineId } = req.params;
    const { id: creatorId } = req.user;
    const routine = await destroyRoutine(routineId, creatorId);
    res.send(routine);
  } catch (error) {
    console.log("There was an error deleting a routine: ", error);
    next(error);
  }
});

// POST /api/routines/:routineId/activities
routinesRouter.post("/:routineId/activities", async (req, res, next) => {
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
    console.log("There was an error adding an activity to a routine: ", error);
    next(error);
  }
});

module.exports = routinesRouter;
