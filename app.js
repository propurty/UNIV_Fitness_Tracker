require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

const apiRouter = require("./api");
app.use("/api", apiRouter);

// Setup your Middleware and API Router here

app.get("*", (req, res) => {
  res.status(404).send({
    error: "404 - Not Found",
    message: "No route found for the requested URL",
  });
});

// app.use((error, req, res, next) => {
//   res.status(500).send({ error });
// });

// app.use((req, res, next) => {
//   res.status(404).send("Whoops! 404 Not Found!");
// });

app.use((error, req, res) => {
  console.error("SERVER ERROR: ", error);
  if (res.statusCode < 400) res.status(500);
  res.send({
    error: error.message,
    name: error.name,
    message: error.message,
    table: error.table,
  });
});

module.exports = app;
