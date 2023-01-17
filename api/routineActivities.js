const express = require("express");
const routineActivitiesRouter = express.Router();
const {
  // getRoutineActivityById,
  updateRoutineActivity,
  // getRoutineById,
  destroyRoutineActivity,
} = require("../db");

// PATCH /api/routine_activities/:routineActivityId
routineActivitiesRouter.patch("/:routineActivityId", async (req, res, next) => {
  const { count, duration } = req.body;
  const { routineActivityId: id } = req.params;
  try {
    const update = await updateRoutineActivity({ count, duration, id });
    res.send(update);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// DELETE /api/routine_activities/:routineActivityId
routineActivitiesRouter.delete(
  "/:routineActivityId",
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const routine_activities = await destroyRoutineActivity({ id });
      res.send(routine_activities);
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);
module.exports = routineActivitiesRouter;
