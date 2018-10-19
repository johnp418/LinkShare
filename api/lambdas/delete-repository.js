const AWS = require("aws-sdk");
const { okResponse, errorResponse } = require("../helpers/gateway-response");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const { id, userId = "John Park" } = event;

  const deleteRepoParams = {
    TableName: "UserRepository",
    Key: {
      Id: id,
      UserId: userId
    }
  };

  docClient
    .delete(deleteRepoParams)
    .promise()
    .then(deleteRepo => {
      console.log("Deleted Repo ", deleteRepo);

      // Remove all repository links associated with the repo
      const deleteAllUserRepoLinksParams = {
        TableName: "UserRepositoryLink",
        Key: {
          Id: id,
          UserId: userId
        }
      };

      return docClient.delete(deleteAllUserRepoLinksParams).promise();
    })
    .then(deleteAllRepoLinks => {
      console.log("deleteAllRepoLinks ", deleteAllRepoLinks);
      context.succeed(okResponse({ success: true }));
    })
    .catch(err => {
      console.error("Unable to delete item. Error:", err);
      context.fail(errorResponse(err, context));
    });
};
