const http = require("http");
const chalk = require("chalk");
const app = require("./app");
const { client } = require("./db");

const PORT = process.env["PORT"] ?? 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
  client.connect();
  console.log(
    chalk.blueBright("Server is listening on PORT:"),
    chalk.yellow(PORT),
    chalk.blueBright("Get your routine on!")
  );
});
