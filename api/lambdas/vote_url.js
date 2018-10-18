const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const { linkId, like, userId } = event.body;
  const linkUpdateParams = {
    TableName: "Link",
    Key: {
      Id: linkId
    },
    ExpressionAttributeValues: {
      ":val": 1
    },
    UpdateExpression: like
      ? "set Like = Like + :val"
      : "set Dislike = Dislike + :val",
    ReturnValues: "UPDATED_NEW"
  };
  const userVoteParams = {
    TableName: "UserVote",
    Key: {
      UserId: userId,
      LinkId: linkId
    },
    UpdateExpression: "set #L = :l",
    ExpressionAttributeNames: {
      "#L": "Like"
    },
    ExpressionAttributeValues: {
      ":l": like ? 1 : -1
    }
  };
  console.log("Link Update ", linkUpdateParams);
  console.log("UserVote Update ", userVoteParams);

  // Updates Link table
  docClient
    .update(linkUpdateParams)
    .promise()
    .then(data => {
      console.log("Data ", data);
      // Updates UserVote table
      return docClient.update(userVoteParams).promise();
    })
    .then(data => {
      console.log("Updated UserVoteTable ", data);
    })
    .catch(err => {
      console.error("Unable to update item. Error JSON:", err);
    });
};
