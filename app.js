require("dotenv").config();
const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

// Setup your Middleware and API Router here

module.exports = app;
