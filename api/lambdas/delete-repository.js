const AWS = require("aws-sdk");
const { batchWrite, queryR } = require("./lambda-util");
const { ok, error } = require("../helpers/gateway-response");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

const getUserRepoLinks = async (repoId, userId) => {
  const queryParam = {
    TableName: "UserRepositoryLink",
    IndexName: "UserRepoIndex",
    ProjectionExpression: "#i",
    KeyConditionExpression: "RepositoryId = :r and UserId = :u",
    ExpressionAttributeNames: {
      "#i": "Id"
    },
    ExpressionAttributeValues: {
      ":r": repoId,
      ":u": userId
    }
  };
  return queryR(docClient, queryParam, []);
};

const deleteUserRepoLinks = async (repoId, userId) => {
  // Scan to retrieve all links associated with the repo
  const repoLinks = await getUserRepoLinks(repoId, userId);
  console.log("Repository To delete ", repoLinks);
  if (repoLinks.length === 0) {
    return Promise.resolve();
  }
  const deleteQueries = repoLinks.map(repoLink => {
    return {
      DeleteRequest: {
        Key: {
          Id: repoLink.Id,
          UserId: userId
        }
      }
    };
  });
  return batchWrite(docClient, "UserRepositoryLink", deleteQueries);
};

exports.handler = async (event, context, callback) => {
  const { id, userId = "df00c9ad-fbb2-4809-8798-5622f2f5cadd" } = event;

  // TODO: Check ownership of this repo
  const deleteRepoParams = {
    TableName: "UserRepository",
    Key: {
      Id: id
    }
  };

  try {
    await docClient.delete(deleteRepoParams).promise();

    // Remove all repository links associated with the repo
    await deleteUserRepoLinks(id, userId);

    context.succeed(ok({ success: true }));
  } catch (err) {
    console.log("DeleteRepository Fail Error ", err);
    context.fail(error(err, context));
  }
};
