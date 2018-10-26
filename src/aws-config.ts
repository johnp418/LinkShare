interface AWSConfig {
  region: string;
  Auth: {
    userPoolId: string;
    userPoolWebClientId: string;
  };
}

export default {
  region: "us-west-2",
  Auth: {
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: "us-west-2_jzMIrUxRF",

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: "5pfs7fu9rb9tnnfre1a6id3htf"
  }
};
