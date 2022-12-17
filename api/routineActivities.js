const express = require('express');
const router = express.Router();
const routine_activitiesRouter = express.Router();
const {
    //getRoutineActivityById,
    //addActivityToRoutine,
    //getRoutineActivitiesByRoutine,
    updateRoutineActivity, 
    destroyRoutineActivity,
    //canEditRoutineActivity,
} = require("../db")

// PATCH /api/routine_activities/:routineActivityId
routine_activitiesRouter.patch("/:routineActivityId", async (req, res, next) => {
    const { count, duration } = req.body;
    const { routineActivityId: id } = req.params;
    try {
        const update = await updateRoutineActivity({count, duration, id});
        res.send(update);
    } catch ({name, message}) {
        next ({name, message})
    }
});

// DELETE /api/routine_activities/:routineActivityId
routine_activitiesRouter.delete("/:routineActivityId", async (req, res, next) => {
const { id } = req.params;
try {
    const routine_activities = await destroyRoutineActivity({ id });
    res.send(routine_activities)
} catch ({name, message}) {
    next({name, message})
} 
})
module.exports = router;
