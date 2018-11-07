const AWS = require("aws-sdk");
const { hash } = require("../helpers/util");
const { created, error } = require("../helpers/gateway-response");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context) => {
  const { title } = event;
  // const userId =
  //   event.requestContext.authorizer.claims["cognito:username"]
  const userId = "df00c9ad-fbb2-4809-8798-5622f2f5cadd";
  const AddDate = new Date().toISOString();
  const userRepoId = hash(title + userId + AddDate);

  console.log("Context ", context);
  // console.log("Remaining ", context.getRemainingTimeInMillis());

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
      console.log("Response ", created(Item));
      context.succeed(created(Item));
    })
    .catch(err => {
      console.log("Error ", err);
      context.fail(error(err, context));
    });
};
