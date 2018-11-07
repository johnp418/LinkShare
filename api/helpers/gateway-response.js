module.exports = {
  ok: response => {
    return {
      statusCode: 200,
      body: JSON.stringify(response),
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    };
  },
  created: response => {
    return {
      statusCode: 201,
      body: JSON.stringify(response),
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    };
  },
  error: (err, context) => {
    return {
      statusCode: 500,
      body: JSON.stringify({
        Error: err.message,
        Reference: context.awsRequestId
      }),
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    };
  }
};
