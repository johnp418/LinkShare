const AWS = require("aws-sdk");
const { okResponse, errorResponse } = require("../helpers/gateway-response");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

const batchQuery = (repoParams, data) => {
  return docClient
    .query(repoParams)
    .promise()
    .then(batchData => {
      console.log("Query Result ", batchData);
      batchData.Items.forEach(item => data.push(item));
      if (typeof batchData.LastEvaluatedKey !== "undefined") {
        // continue scanning if we have more movies, because
        // scan can retrieve a maximum of 1MB of data
        return batchQuery(repoParams, data);
      }
      return Promise.resolve(data);
    })
    .catch(err => {
      //
      console.log("Query Error ", err);
      throw new Error("Fail query ", err);
    });
};

exports.handler = async (event, context, callback) => {
  console.log("Event ", event);
  console.log("Context ", context);
  // const requestBody = JSON.parse(event.body);
  const { id, userId } = event;
  const getRepoQueryParams = {
    TableName: "UserRepository",
    Key: {
      Id: id,
      UserId: userId
    }
  };

  try {
    const userRepo = await docClient.get(getRepoQueryParams).promise();
    const { Root: root, Title: title } = userRepo.Item;
    console.log("UserRepo ", userRepo);
    const getUserRepoParams = {
      TableName: "UserRepositoryLink",
      IndexName: "UserRepoIndex",
      ProjectionExpression:
        "#I, #T, #LK, ParentId, Title, AddDate, LastModified, #L, Dislike, Children",
      KeyConditionExpression: "RepositoryId = :r and UserId = :u",
      ExpressionAttributeNames: {
        "#I": "Id",
        "#L": "Like",
        "#T": "Type",
        "#LK": "LinkId"
      },
      ExpressionAttributeValues: {
        ":r": id,
        ":u": userId
      }
    };

    const batchQueryResult = await batchQuery(getUserRepoParams, []);
    // console.log("Batch Query Result ", data);

    // Fetch each url data
    const fetchAllLinks = batchQueryResult
      .filter(repoLink => repoLink.Type !== "folder")
      .map(repoLink => {
        const getLinkParam = {
          TableName: "Link",
          Key: {
            Id: repoLink.LinkId
          },
          ProjectionExpression: "#I, #L, Dislike, Icon, #U, Popularity",
          ExpressionAttributeNames: {
            "#I": "Id",
            "#L": "Like",
            "#U": "Url"
          }
        };
        return docClient
          .get(getLinkParam)
          .promise()
          .then(result => result.Item);
      });

    let links = await Promise.all(fetchAllLinks);
    links = links.reduce((acc, linkItem) => {
      if (linkItem.Icon === "None") {
        const { Icon, ...rest } = linkItem;
        acc[linkItem.Id] = { ...rest };
      } else {
        acc[linkItem.Id] = linkItem;
      }
      return acc;
    }, {});

    const repository = batchQueryResult.reduce((acc, repoLink) => {
      acc[repoLink.Id] = repoLink;
      return acc;
    }, {});

    context.succeed(okResponse({ id, title, root, repository, link: links }));
  } catch (err) {
    context.fail(errorResponse(err, context));
  }
};
