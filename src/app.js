const express = require("express");
const cors = require("cors");
const {uuid, isUuid} = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/*const repositories = [
  {
    "id": "4e44d535-a3f0-40e3-941c-33a3429f106e",
    "title": "React Native Game",
    "url": "git.com/platformrngame",
    "techs": [
      "reactnative",
      "gamedevelopment"
    ],
    "likes": 0
  }
];*/

function validateProjectID(req, res, next) {
  const {id} = req.params;
  if(!isUuid(id)) {
    return res.status(400).json({error: 'ID Is Not Valid!'});
  }
  return next();
}

app.use('/repositories/:id', validateProjectID);

app.get("/repositories", (request, response) => {  
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  
  const {title, url, techs} = request.body;

  const repo = {id: uuid(), title, url, techs, likes: 0};

  repositories.push(repo);

  return response.json(repo);
  
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repoIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repoIndex < 0)
    return response.status(400).json({error: 'Repositorie Not Found.'});

  repositories[repoIndex] = {id: repositories[repoIndex].id, 
                              title, url, techs, likes: repositories[repoIndex].likes};

  return response.json(repositories[repoIndex]);

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  
  const repoIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repoIndex < 0)
    return response.status(400).json({error: 'Repositorie Not Found.'});

  repositories.splice(repoIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  
  const repoIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repoIndex < 0)
    return response.status(400).json({error: 'Repositorie Not Found.'});

  const {title, url, techs} = repositories[repoIndex];
  const likes = repositories[repoIndex].likes + 1;

  repositories[repoIndex] = {id, title, url, techs, likes};

  return response.json({likes});

});

module.exports = app;
