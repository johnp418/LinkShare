import Amplify, { Hub, Logger } from "aws-amplify";

export const alex = new Logger("Alexander_the_auth_watcher");

alex.onHubCapsule = capsule => {
  switch (capsule.payload.event) {
    case "signIn":
      alex.error("user signed in"); //[ERROR] Alexander_the_auth_watcher - user signed in
      console.log("Capsuel ? ", capsule);
      break;
    case "signUp":
      alex.error("user signed up");
      break;
    case "signOut":
      alex.error("user signed out");
      break;
    case "signIn_failure":
      alex.error("user sign in failed");
      break;
    case "configured":
      alex.error("the Auth module is configured");
  }
};

Hub.listen("auth", alex);
