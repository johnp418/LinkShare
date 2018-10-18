const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const { userRepositoryLinkId, linkId, like, userId } = event.body;
  // TODO: Change link's popularity and like / dislike

  const deleteRepoLinkParams = {
    TableName: "UserRepositoryLink",
    Key: {
      Id: userRepositoryLinkId,
      UserId: userId
    }
  };
  const deleteUserVoteParams = {
    TableName: "UserVote",
    Key: {
      UserId: userId,
      LinkId: linkId
    }
  };

  docClient
    .delete(deleteRepoLinkParams)
    .promise()
    .then(() => {
      return docClient.delete(deleteUserVoteParams).promise();
    })
    .then(() => {
      console.log("Done");
    })
    .catch(err => {
      console.error("Unable to delete item. Error:", err);
    });
};
