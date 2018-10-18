const AWS = require("aws-sdk");
const { hash } = require("../helpers/util");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context) => {
  const { title, userId } = event;
  const AddDate = new Date().toISOString();
  const userRepoId = hash(title + userId + AddDate);

  console.log("Context ", context);
  console.log("Remaining ", context.getRemainingTimeInMillis());

  // Save user repos
  const Item = {
    Id: userRepoId,
    UserId: userId,
    Title: title,
    Like: 0,
    Dislike: 0,
    AddDate,
    LastModified: AddDate,
    Root: [] // Array containing root folder repo ids
  };
  const userRepoParams = {
    TableName: "UserRepository",
    Item
  };
  docClient
    .put(userRepoParams)
    .promise()
    .then(() => {
      console.log("Created user repo");
      context.done(null, {
        statusCode: 201,
        body: JSON.stringify(Item),
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      });
    })
    .catch(err => {
      console.error("Error creating repo. Error:", err);
      context.fail({
        statusCode: 500,
        body: JSON.stringify({
          Error: err,
          Reference: context.awsRequestId
        }),
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      });
    });
};
