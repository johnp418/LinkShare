const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

const params = {
  TableName: "User",
  ProjectionExpression: "id, #name, password, info.rating",
  // FilterExpression: "#yr between :start_yr and :end_yr",
  ExpressionAttributeNames: {
    "#name": "name"
  }
};

// Write
const batchWriteUserRepoLinks = queries => {
  const batchWriteParam = {
    RequestItems: {
      UserRepositoryLink: queries.slice(0, 25)
    }
  };
  return docClient
    .batchWrite(batchWriteParam)
    .promise()
    .then(data => {
      console.log("Batch done, queries left ", queries.length);
      const nextQueries = queries.slice(25);
      // There are no more queries to handle, so just resolve
      if (nextQueries.length === 0) {
        return Promise.resolve();
      }
      return batchWriteUserRepoLinks(nextQueries);
    })
    .catch(err => {
      console.error("Error ", err);
      throw new Error("Failed to BatchWriteItem For UserRepoLink: ", err);
    });
};

const queries = [];
for (let i = 0; i < 500; i++) {
  queries.push({
    PutRequest: {
      Item: {
        Id: String(i),
        UserId: "John Park",
        RepositoryId: "Repo1e",
        LinkId: `link${i}`,
        Title: `Title ${i}`,
        Type: `bookmark`,
        Children: [],
        AddDate: new Date().toISOString(),
        LastModified: new Date().toISOString()
      }
    }
  });
}
for (let i = 0; i < 500; i++) {
  queries.push({
    PutRequest: {
      Item: {
        Id: String(i),
        UserId: "Park",
        RepositoryId: "wtf",
        LinkId: `link${i}`,
        Title: `Title ${i}`,
        Type: `bookmark`,
        Children: [],
        AddDate: new Date().toISOString(),
        LastModified: new Date().toISOString()
      }
    }
  });
}

batchWriteUserRepoLinks(queries);
