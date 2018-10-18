const AWS = require("aws-sdk");
const R = require("ramda");
const async = require("async");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

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
        return Promise.resolve(data);
      }
      return batchWriteUserRepoLinks(nextQueries);
    })
    .catch(err => {
      throw new Error("Failed to BatchWriteItem For UserRepoLink: ", err);
    });
};

exports.handler = (event, context, callback) => {
  console.log("Event ", event, " Context ", context);

  const { root, repository, link, title, id } = event;
  const userId = "John Park";
  const AddDate = new Date().toISOString();

  // Update user repos
  const userRepoParams = {
    TableName: "UserRepository",
    Key: {
      Id: id,
      UserId: userId
    },
    UpdateExpression: "set #R = :r, #LD = :ld, #T = :t",
    ExpressionAttributeNames: {
      "#R": "Root",
      "#LD": "LastModified",
      "#T": "Title"
    },
    ExpressionAttributeValues: {
      ":ld": AddDate,
      ":r": root, // Array containing root folder repo ids
      ":t": title
    },
    ReturnValues: "UPDATED_NEW"
  };
  console.log("Save Repo ", userRepoParams);
  docClient
    .update(userRepoParams)
    .promise()
    .then(async data => {
      console.log("Saved user repo : ", data);

      // TODO: BatchWrite
      // Saves all repository links to user
      const createRepoLinkQueries = R.map(repo => {
        const {
          id,
          repositoryId,
          parentId,
          linkId,
          title,
          type,
          children
        } = repo;
        return {
          PutRequest: {
            Item: {
              Id: id,
              UserId: userId,
              ParentId: parentId,
              RepositoryId: repositoryId,
              LinkId: linkId,
              Title: title,
              Type: type,
              Children: children,
              AddDate,
              LastModified: AddDate
            }
          }
        };
      }, R.values(repository));
      console.log("CreateRepoLinks ", createRepoLinkQueries);

      // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-table-read-write-batch.html
      batchWriteUserRepoLinks(createRepoLinkQueries).then(async () => {
        console.log("Successfully created userRepoLinks ");
        const upsertLinkQueries = R.map(linkItem => {
          const { id, icon = "None", url, name } = linkItem;
          return () => {
            const linkUpdate = {
              TableName: "Link",
              Key: {
                Id: id
              },
              UpdateExpression:
                "set #P = if_not_exists(#P, :p) + :val, #I = :i, #N = :n, #L = :l, #D = :d, #U = :u",
              ExpressionAttributeNames: {
                "#P": "Popularity",
                "#L": "Like",
                "#D": "Dislike",
                "#I": "Icon",
                "#N": "Name",
                "#U": "Url"
              },
              ExpressionAttributeValues: {
                ":val": 1,
                ":p": 0,
                ":i": icon,
                ":n": "name",
                ":l": 0,
                ":d": 0,
                ":u": url
              },
              ReturnValues: "UPDATED_NEW"
            };
            console.log("Update Query for ", id);
            return docClient.update(linkUpdate).promise();
          };
        }, R.values(link));
        console.log("upsertLinkQueries ", upsertLinkQueries);

        for (const updateQ of upsertLinkQueries) {
          await updateQ();
        }
        console.log("All done");
        context.succeed({
          statusCode: 200,
          body: JSON.stringify({ success: true }),
          headers: {
            "Access-Control-Allow-Origin": "*"
          }
        });
      });

      // async.series(
      //   [
      //     function(callback) {
      //       // do some stuff ...
      //       callback(null, "one");
      //     },
      //     function(callback) {
      //       // do some more stuff ...
      //       callback(null, "two");
      //     }
      //   ],
      //   // optional callback
      //   function(err, results) {
      //     // results is now equal to ['one', 'two']
      //   }
      // );
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
};
