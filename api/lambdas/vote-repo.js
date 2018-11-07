const AWS = require("aws-sdk");
const { ok, error } = require("../helpers/gateway-response");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  // like as boolean
  const { repoId, like, userId } = event.body;
  const repoUpdateParams = {
    TableName: "UserRepository",
    Key: {
      Id: repoId,
      UserId: userId
    },
    ExpressionAttributeValues: {
      ":val": 1
    },
    UpdateExpression: like
      ? "set Like = Like + :val"
      : "set Dislike = Dislike + :val",
    ReturnValues: "UPDATED_NEW"
  };
  // TODO: Use set or map
  const updateUserParams = {
    TableName: "User",
    Key: {
      UserId: userId,
      Id: repoId
    },
    UpdateExpression: "set #L = :l",
    ExpressionAttributeNames: {
      "#L": "Like"
    },
    ExpressionAttributeValues: {
      ":l": like ? 1 : -1
    }
  };
  console.log("Repo Update ", repoUpdateParams);
  console.log("UserVote Update ", updateUserParams);

  // Updates Link table
  docClient
    .update(repoUpdateParams)
    .promise()
    .then(data => {
      console.log("Data ", data);
      // Updates UserVote table
      return docClient.update(updateUserParams).promise();
    })
    .then(data => {
      console.log("Updated UserVoteTable ", data);
      context.succeed(ok(data));
    })
    .catch(err => {
      context.fail(error(err, context));
    });
};
