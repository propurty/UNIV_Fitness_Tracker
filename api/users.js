const express = require('express');
const router = express.Router();

const { createUser, getUser, getUserById, getUserByUsername } = require('../db/users')

// POST /api/users/login


// POST /api/users/register

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
