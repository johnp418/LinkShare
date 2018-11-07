const batchWrite = (docClient, tableName, queries) => {
  const batchWriteParam = {
    RequestItems: {
      [tableName]: queries.slice(0, 25)
    }
  };
  return docClient
    .batchWrite(batchWriteParam)
    .promise()
    .then(data => {
      console.log("BatchWrite ", data);
      const nextQueries = queries.slice(25);
      console.log("Batch done, queries left ", nextQueries.length);

      // There are no more queries to handle, so just resolve
      if (nextQueries.length === 0) {
        return Promise.resolve(data);
      }
      return batchWrite(docClient, tableName, nextQueries);
    })
    .catch(err => {
      console.log("Error => ", err);
      throw new Error(`Failed to BatchWriteItem For [${tableName}]: `, err);
    });
};

const queryR = (docClient, queryParam, result) => {
  return docClient
    .query(queryParam)
    .promise()
    .then(batchData => {
      batchData.Items.forEach(item => result.push(item));
      // continue scanning if there is more data
      if (typeof batchData.LastEvaluatedKey !== "undefined") {
        console.log("Scanning for more...");
        queryParam.ExclusiveStartKey = batchData.LastEvaluatedKey;
        return queryR(docClient, queryParam, result);
      }
      return result;
    })
    .catch(err => {
      throw new Error(`Failed to query ${queryParam} Error :`, err);
    });
};

module.exports = {
  queryR,
  batchWrite
};
