const AWS = require("aws-sdk");
const R = require("ramda");
// const async = require("async");
const { ok, error } = require("../helpers/gateway-response");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

const createUserRepo = async (id, userId, root, title) => {
  const userRepoParams = {
    TableName: "UserRepository",
    Key: {
      Id: id
    },
    UpdateExpression: "set #R = :r, #LD = :ld, #T = :t, #U = :u",
    ExpressionAttributeNames: {
      "#R": "Root",
      "#U": "UserId",
      "#LD": "LastModified",
      "#T": "Title"
    },
    ExpressionAttributeValues: {
      ":ld": new Date().toISOString(),
      ":r": root, // Array containing root folder repo ids
      ":t": title,
      ":u": userId
    },
    ReturnValues: "UPDATED_NEW"
  };
  return await docClient.update(userRepoParams).promise();
};

const createLinks = async link => {
  // TODO: Should update link sequentially
  const upsertLinkQueries = R.map(linkItem => {
    const { id, icon = "None", url } = linkItem;
    const linkUpdate = {
      TableName: "Link",
      Key: {
        Id: id
      },
      UpdateExpression:
        "set #P = if_not_exists(#P, :p) + :val, #I = :i, #L = :l, #D = :d, #U = :u",
      ExpressionAttributeNames: {
        "#P": "Popularity",
        "#L": "Like",
        "#D": "Dislike",
        "#I": "Icon",
        "#U": "Url"
      },
      ExpressionAttributeValues: {
        ":val": 1,
        ":p": 0,
        ":i": icon,
        ":l": 0,
        ":d": 0,
        ":u": url
      },
      ReturnValues: "UPDATED_NEW"
    };
    return docClient.update(linkUpdate).promise();
  }, R.values(link));
  return Promise.all(upsertLinkQueries);
};

// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-table-read-write-batch.html
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
      console.log("BatchWrite ", data);
      const nextQueries = queries.slice(25);
      console.log("Batch done, queries left ", queries.length);

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

const createUserRepoLinks = (repositoryId, repository, userId) => {
  const AddDate = new Date().toISOString();
  const createRepoLinkQueries = R.map(repo => {
    const { parentId, linkId, title, type, children } = repo;
    return {
      PutRequest: {
        Item: {
          Id: repo.id,
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
  return batchWriteUserRepoLinks(createRepoLinkQueries);
};

// TODO: Authenticate
exports.handler = async (event, context, callback) => {
  // console.log("Event ", event);
  // console.log("Context ", context);
  const {
    root,
    repository,
    link,
    title,
    id,
    userId = "df00c9ad-fbb2-4809-8798-5622f2f5cadd"
  } = event;

  try {
    // Saves user repo
    const userRepo = await createUserRepo(id, userId, root, title);
    console.log("Created user repo ", userRepo);

    // Saves all repository links to user
    await createUserRepoLinks(id, repository, userId);
    console.log("Created user repo links");

    // Saves all links uploaded
    await createLinks(link);
    console.log("Created links");

    context.succeed(ok({ success: true }));
  } catch (err) {
    context.fail(error(err, context));
  }
};
