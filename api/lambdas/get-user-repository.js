const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  console.log("Event ", event);
  console.log("Context ", context);
  // const requestBody = JSON.parse(event.body);

  // Retrieve every existing repository
  // TODO: Use batchGet with date filter for pagination later
  const getRepoScanParams = {
    TableName: "UserRepository",
    ProjectionExpression:
      "#i, UserId, Title, AddDate, LastModified, #l, Dislike",
    ExpressionAttributeNames: {
      "#i": "Id",
      "#l": "Like"
    }
  };
  docClient
    .scan(getRepoScanParams)
    .promise()
    .then(data => {
      console.log("Data ", data);
      context.succeed({
        statusCode: 200,
        body: JSON.stringify(data.Items),
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      });
    })
    .catch(err => {
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
