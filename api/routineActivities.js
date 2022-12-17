const express = require('express');
const router = express.Router();
const routine_activitiesRouter = express.Router();
const {
    getRoutineActivityById,
    addActivityToRoutine,
    getRoutineActivitiesByRoutine,
    updateRoutineActivity,
    destroyRoutineActivity,
    canEditRoutineActivity,
} = require("../db")
// PATCH /api/routine_activities/:routineActivityId

// DELETE /api/routine_activities/:routineActivityId

module.exports = router;
