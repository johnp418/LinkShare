const path = require("path");
const express = require("express");
const lambdaLocal = require("lambda-local");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const camelcaseKeys = require("camelcase-keys");

const app = new express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("combined"));

app.get("/repo", (req, res) => {
  lambdaLocal
    .execute({
      event: {},
      lambdaPath: path.join(__dirname, "./lambdas/get-user-repository.js"),
      timeoutMs: 3000
    })
    .then(lambdaRes => {
      // console.log(done);
      res
        .status(200)
        .send(camelcaseKeys(JSON.parse(lambdaRes.body), { deep: true }));
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.post("/repo", (req, res) => {
  const payload = req.body;
  console.log("POST /repo payload: ", payload);
  lambdaLocal
    .execute({
      event: payload,
      lambdaPath: path.join(__dirname, "./lambdas/create-repository.js"),
      timeoutMs: 3000
    })
    .then(done => {
      console.log(done);
      res
        .status(200)
        .send(camelcaseKeys(JSON.parse(done.body), { deep: true }));
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.get("/repo/:repositoryId", (req, res) => {
  const { repositoryId } = req.params;
  console.log("Repo ", repositoryId);
  lambdaLocal
    .execute({
      event: { id: repositoryId, userId: "John Park" },
      lambdaPath: path.join(__dirname, "./lambdas/get-user-repository-link.js"),
      timeoutMs: 10000
    })
    .then(lambdaRes => {
      // console.log(done);
      res
        .status(200)
        .send(camelcaseKeys(JSON.parse(lambdaRes.body), { deep: true }));
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
});

// TODO: Check auth
// Import repo
app.post("/repo/:repositoryId", (req, res) => {
  const payload = req.body;
  const { repositoryId } = req.params;
  console.log("POST /repo payload: ", payload);
  lambdaLocal
    .execute({
      event: { id: repositoryId, ...payload },
      lambdaPath: path.join(__dirname, "./lambdas/import-repository.js"),
      timeoutMs: 3000
    })
    .then(done => {
      console.log(done);
      res
        .status(200)
        .send(camelcaseKeys(JSON.parse(done.body), { deep: true }));
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.delete("/repo/:repositoryId", (req, res) => {
  const { repositoryId } = req.params;
  console.log("DELETE /repo payload: ", repositoryId);
  lambdaLocal
    .execute({
      event: { repositoryId },
      lambdaPath: path.join(__dirname, "./lambdas/delete-repository.js"),
      timeoutMs: 3000
    })
    .then(done => {
      console.log(done);
      res.status(200).send(camelcaseKeys(JSON.parse(done.body)));
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.listen(3001, () => {
  console.log("Server started ");
});
