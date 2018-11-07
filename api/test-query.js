const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

const queries = [
  {
    DeleteRequest: {
      Key: {
        Id: "a2325ad4eecc2ea21d815b1d8acf21b77539120d165a10e5d46017defded8799",
        UserId: "df00c9ad-fbb2-4809-8798-5622f2f5cadd"
      }
    }
  }
];
docClient
  .batchWrite({
    RequestItems: {
      UserRepositoryLink: queries
    }
  })
  .promise()
  .then(
    d => {
      console.log("Done ", d);
    },
    err => {
      console.log("Errror => ", err);
    }
  );
