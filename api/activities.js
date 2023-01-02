const express = require('express');
const activitiesRouter = express.Router();
const { getAllActivities,
    getActivityById,
    getActivityByName,
    attachActivitiesToRoutines,
    createActivity,
    updateActivity,} = require("../db");

// GET /api/activities/:activityId/routines
activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
    const {id} = req.params;
    try {
        const activites = await getActivityById({ id });
        res.send(activites);
    } catch ({ name, message }) {
        next({ name, message });
    }
});

// GET /api/activities
activitiesRouter.get("/", async (req, res, next) => {
    try {
        const activities = await getAllActivities();
        res.send(activities);
    } catch ({ name, message }) {
        next ({ name, message });
    }
});

// POST /api/activities
activitiesRouter.post("/", async (req, res, next) => {
    const { name, description } = req.body;
    try {
        const newActivity = createActivity({ name, description });
        res.send(newActivity);
    } catch ({ name, message }) {
        next ({ name, message });
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
        next ({ name, message });
    }
});

module.exports = router;
