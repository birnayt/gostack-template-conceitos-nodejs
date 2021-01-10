const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());
const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  if (isUuid(id)) {  
    repositories.map((repository, index) => {
      const newRepository = {
        id: repository.id,
        title: title ? title : repository.title,
        url: url ? url : repository.url,
        techs: techs ? techs : repository.techs,
        likes: repository.likes
      }

      if (repository.id === id) {
        repositories[index] = newRepository;
        return response.status(200).json(newRepository);
      }
    })
  } else {
    return response.status(400).json({
      error: "Sorry, but invalid repository ID."
    });
  }
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (isUuid(id)) {
    repositories.map((repository, index) => {
      if(repository.id === id) {
        repositories.splice(index, 1);
        return response.status(204).json();
      }
    })

  } else {
    return response.status(400).json({
      error: "Sorry, but invalid repository ID."
    })
  }
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if (isUuid(id)) {
    repositories.map((repository, index) => {
      if (repository.id == id) {
        repository.likes += 1;
        return response.status(400).json(repository);
      }
    })

  } else {
    return response.status(400).json({
      error: "Sorry, but invalid repository ID."
    })
  }
});

module.exports = app;
