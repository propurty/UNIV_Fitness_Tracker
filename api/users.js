const express = require('express');
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const {JWT_SECRET = 'bigSecret'} = process.env;

const { createUser, getUser, getUserById, getUserByUsername, getPublicRoutinesByUser } = require('../db')

// POST /api/users/login
usersRouter.post("/login", async (req, res, next) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            next({
                name: "missingCredentials",
                message: "Please input the username and password"
            });
        }
        const user = await getUser({ username, password });
        if(!user) {
            next({
                name: "missingUser",
                message: "User does not exist, please sign up"
            });
        }
        else {
            const token = jwt.sign({
                id: user.id,
                username: user.username
            }, JWT_SECRET);
            res.send({ user, message: "Thank you for signing up", token: token});
        }
    } catch ({ name, message }) {
        next({name, message});
    }
});

// POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const_user = await getUserByUsername(username);
        if (_user)
 {
    next({
        name: "userAlreadyExists",
        message: "A user with that username already exists",
    });
 } else if (password.length < 8) {
    next({
        name: "passwordTooShort",
        message: "Password must be at least 8 characters",
    });
 } else {
    const user = await createUser({ username, password });
    const token = jwt.sign(user, JWT_SECRET);
    if(!user) {
        next({
            message: "Error, there is no user"
        })
    }
    res.send({user, token});
 } 
} catch ({ name, message }) {
    next({ name, message });
}
});

// GET /api/users/me
usersRouter.get("/me", async (req, res, next) => {
    if (!req.user) {
        next({
            name: "missingUser",
            message: "You must be logged in"
        });
    } else {
        next();
    }
});

// GET /api/users/:username/routines
usersRouter.get("/:username/routines", async(req, res, next) => {
    const { username } = req.params
    try {
        const routines = await getPublicRoutinesByUser({username});
        res.send(routines)
    } catch (error) {
        next (error)
    }
});

module.exports = router;
