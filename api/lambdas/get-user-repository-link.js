const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

// const batch = queries => {
//   if (queries.length === 0) return [];
//   const batchGet = {
//     RequestItem: {
//       UserRepositoryLink: queries.slice(0, 100)
//     }
//   };
//   return docClient
//     .batchGet(batchGet)
//     .promise()
//     .then(batchData => {
//       const nextQueries = queries.slice(100);
//       return batchData.concat(batch(nextQueries));
//     })
//     .catch(err => {
//       throw new Error("Failed to carry out batch operation: ", err);
//     });
// };

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

exports.handler = (event, context, callback) => {
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
  docClient
    .get(getRepoQueryParams)
    .promise()
    .then(userRepo => {
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

      batchQuery(getUserRepoParams, [])
        .then(data => {
          // console.log("Batch Query Result ", data);

          // Fetch each url data
          const links = data.filter(repoLink => repoLink.Type !== "folder");
          const all = links.map(repoLink => {
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
          Promise.all(all).then(linkData => {
            // console.log("Link Data ", linkData);
            const repository = data.reduce((acc, repoLink) => {
              acc[repoLink.Id] = repoLink;
              return acc;
            }, {});
            const link = linkData.reduce((acc, linkItem) => {
              if (linkItem.Icon === "None") {
                const { Icon, ...rest } = linkItem;
                acc[linkItem.Id] = { ...rest };
              } else {
                acc[linkItem.Id] = linkItem;
              }
              return acc;
            }, {});
            context.succeed({
              statusCode: 200,
              body: JSON.stringify({ id, title, root, repository, link }),
              headers: {
                "Access-Control-Allow-Origin": "*"
              }
            });
          });
        })
        .catch(err => {
          console.log("BatchQuery Error ", err);
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
    });
};
