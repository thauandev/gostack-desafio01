const express = require("express");

const server = express();
server.use(express.json());

const projects = [];
let count = 0;

function request(req, res, next) {
  count++;
  console.log(`Número de requisições: ${count}`);
  console.log(`Method: ${req.method}; URL: ${req.url}`);
  return next();
}

server.use(request);

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

function checkId(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);
  if (!project) {
    return res.status(400).json({ error: " Id not exist" });
  }

  return next();
}

server.put("/projects/:id", checkId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.title = title;

  return res.json(projects);
});

server.delete("/projects/:id", checkId, (req, res) => {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);
  projects.splice(id, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkId, (req, res) => {
  const { id } = req.params;
  const { tasks } = req.body;

  const project = projects.find(p => p.id == id);
  project.tasks = tasks;

  return res.json(projects);
});

server.listen(3000);
