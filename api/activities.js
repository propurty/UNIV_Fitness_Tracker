const express = require("express");
const activitiesRouter = express.Router();

const {
  getAllActivities,
  getActivityByName,
  createActivity,
  updateActivity,
  getPublicRoutinesByActivity,
} = require("../db");

// Error if activity exists.
const { ActivityExistsError } = require("../errors");

// GET /api/activities/:activityId/routines
activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  const { activityId } = req.params;
  try {
    const activities = await getPublicRoutinesByActivity({ id: activityId });
    if (!activities.length) {
      next({
        name: "ActivityDoesNotExistError",
        message: `Activity ${activityId} not found`,
      });
    } else {
      res.send(activities);
    }
  } catch (error) {
    next(error);
  }
});

// GET /api/activities
activitiesRouter.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    next(error);
  }
});

// POST /api/activities
activitiesRouter.post("/", async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const activity = await getActivityByName(name);
    if (activity) {
      next({
        name: "ActivityExistsError",
        message: ActivityExistsError(name),
      });
    } else {
      const newActivity = await createActivity({ name, description });
      res.send(newActivity);
    }
  } catch (error) {
    next(error);
  }
});

// PATCH /api/activities/:activityId
activitiesRouter.patch("/:activityId", async (req, res, next) => {
  const { name, description } = req.body;
  const { activityId: id } = req.params;
  try {
    const update = await updateActivity({ id, name, description });
    res.send(update);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = activitiesRouter;
