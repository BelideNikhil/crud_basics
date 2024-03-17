import { createServer } from "http";
import { writeFileSync } from "fs";
import users from "./data.json" assert { type: "json" };
import { v4 as uuidv4 } from "uuid";
import { bodyParser } from "./utils.js";
import "dotenv/config";

const regexV4 = new RegExp(
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
);

const server = createServer(async (request, response) => {
  const baseUrl = request.url.substring(0, request.url.lastIndexOf("/")) + "/";
  const user_id = request.url.split("/")[3];

  // GET all users route
  if (request.url === "/api/users" && request.method === "GET") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(users));
    response.end();
  }
  // GET user by ID route
  if (
    baseUrl === "/api/users/" &&
    regexV4.test(user_id) &&
    request.method === "GET"
  ) {
    const requestedUser = users.find((i) => i.id === user_id);
    response.writeHead(200, { "Content-Type": "application/json" });
    response.write(JSON.stringify(requestedUser));
    response.end();
  }
  // POST new user
  if (request.url === "/api/users" && request.method === "POST") {
    let body = await bodyParser(request);
    const { username, user_email } = body;

    const updatedUsers = [
      ...users,
      { name: username, email: user_email, id: uuidv4() },
    ];

    writeFileSync("./data.json", JSON.stringify(updatedUsers), "utf-8");
    response.writeHead(201, { "Content-Type": "application/json" });
    response.end("User creation Successful!");
  }
  // UPDATE(PUT) existing USER
  if (
    baseUrl === "/api/users/" &&
    regexV4.test(user_id) &&
    request.method === "PUT"
  ) {
    let body = await bodyParser(request);
    const { username, user_email } = body;
    const updatedUsers = users.map((user) =>
      user.id === user_id
        ? { ...user, name: username, email: user_email }
        : user
    );
    writeFileSync("./data.json", JSON.stringify(updatedUsers), "utf-8");
    response.writeHead(201, { "Content-Type": "application/json" });
    response.end("User updation Successful!");
  }
  // DELETE user
  if (
    baseUrl === "/api/users/" &&
    regexV4.test(user_id) &&
    request.method === "DELETE"
  ) {
    const updatedUsers = users.filter((user) => user.id !== user_id);
    writeFileSync("./data.json", JSON.stringify(updatedUsers), "utf-8");
    response.writeHead(201, { "Content-Type": "application/json" });
    response.end("User deletion Successful!");
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`listening on port ${PORT}`));

// enhancements
// Controller
// Error handling
