module.exports = {
  okResponse: response => {
    return {
      statusCode: 200,
      body: JSON.stringify(response),
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    };
  },
  errorResponse: (err, context) => {
    return {
      statusCode: 500,
      body: JSON.stringify({
        Error: err,
        Reference: context.awsRequestId
      }),
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    };
  }
};
