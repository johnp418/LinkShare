const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

const getUserRepoParams = {
  TableName: "UserRepositoryLink",
  IndexName: "UserRepoIndex",
  ProjectionExpression: "#i, #t, #li, Title, AddDate, LastModified, Children",
  KeyConditionExpression: "RepositoryId = :r and UserId = :u",
  ExpressionAttributeNames: {
    "#i": "Id",
    "#t": "Type",
    "#li": "LinkId"
  },
  ExpressionAttributeValues: {
    ":r": "Repo1e",
    ":u": "John Park"
  }
};

const data = [];

const onQuery = (err, batchData) => {
  if (err) {
    console.log("Error ", err);
  } else {
    batchData.Items.forEach(item => {
      data.push(item);
    });

    console.log("batchData ", batchData);
    // continue scanning if we have more movies, because
    // scan can retrieve a maximum of 1MB of data
    if (typeof batchData.LastEvaluatedKey != "undefined") {
      console.log("Scanning for more...");
      getUserRepoParams.ExclusiveStartKey = batchData.LastEvaluatedKey;
      docClient.query(getUserRepoParams, onQuery);
    }
  }
};

docClient.query(getUserRepoParams, onQuery);
