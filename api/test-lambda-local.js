const path = require("path");
const lambdaLocal = require("lambda-local");

lambdaLocal
  .execute({
    event: { body: {} },
    lambdaPath: path.join(__dirname, "./lambdas/get-user-repository.js"),
    timeoutMs: 3000
  })
  .then(done => {
    console.log(done);
  })
  .catch(err => {
    console.log(err);
  });
