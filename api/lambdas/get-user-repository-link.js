const AWS = require("aws-sdk");
const { queryR } = require("./lambda-util");
const { ok, error } = require("../helpers/gateway-response");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

const fetchAllLinks = async repoLinks => {
  // Fetch each url data
  const fetchAllLinks = repoLinks
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
  return await Promise.all(fetchAllLinks);
};

const getUserRepo = async repoId => {
  const getRepoQueryParams = {
    TableName: "UserRepository",
    Key: {
      Id: repoId
    }
  };
  const repo = await docClient.get(getRepoQueryParams).promise();
  if (!repo.Item) {
    throw new Error("Repo does not exist");
  }
  return repo;
};

const getUserRepoLinks = async (repoId, userId) => {
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
      ":r": repoId,
      ":u": userId
    }
  };
  return await queryR(docClient, getUserRepoParams, []);
};

exports.handler = async (event, context, callback) => {
  // console.log("Event ", event);
  // console.log("Context ", context);
  // const requestBody = JSON.parse(event.body);
  const { id, userId = "df00c9ad-fbb2-4809-8798-5622f2f5cadd" } = event;
  // const repoOwnerId =
  //   event.requestContext.authorizer.claims["cognito:username"] || "Unknown";
  const repoOwnerId = userId;

  try {
    // Retrieve user repo
    const userRepo = await getUserRepo(id);
    console.log("UserRepo ", userRepo);
    const { Root: root, Title: title } = userRepo.Item;

    // Retrieve user repo nodes (folders / linkIds)
    const userRepoLinks = await getUserRepoLinks(id, repoOwnerId);

    // Retrieve all links
    const allLinks = await fetchAllLinks(userRepoLinks);

    const links = allLinks.reduce((acc, linkItem) => {
      if (linkItem.Icon === "None") {
        const { Icon, ...rest } = linkItem;
        acc[linkItem.Id] = { ...rest };
      } else {
        acc[linkItem.Id] = linkItem;
      }
      return acc;
    }, {});
    const repository = userRepoLinks.reduce((acc, repoLink) => {
      acc[repoLink.Id] = repoLink;
      return acc;
    }, {});
    context.succeed(
      ok({ id, userId: repoOwnerId, title, root, repository, link: links })
    );
  } catch (err) {
    console.log("GetUserRepositoryLink Error ", err.message);
    context.fail(error(err, context));
  }
};
