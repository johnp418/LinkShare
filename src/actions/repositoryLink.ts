import { createRequestTypes, REQUEST, SUCCESS, FAILURE } from ".";
import { AppState } from "src/types";
import { getCurrentUser } from "src/reducers/selectors";
import axios from "axios";

export const DELETE_REPOSITORY_LINK = createRequestTypes(
  "DELETE_REPOSITORY_LINK"
);
export const FAVORITE_LINK = createRequestTypes("FAVORITE_LINK");
export const LIKE_LINK = createRequestTypes("LIKE_LINK");
export const DISLIKE_LINK = createRequestTypes("DISLIKE_LINK");

export const deleteRepositoryLink = (repoId: string, linkId: string) => {
  return {
    types: [
      DELETE_REPOSITORY_LINK[REQUEST],
      DELETE_REPOSITORY_LINK[SUCCESS],
      DELETE_REPOSITORY_LINK[FAILURE]
    ]
  };
};

export const favoriteLink = (repoId: string) => {
  return {
    types: [
      FAVORITE_LINK[REQUEST],
      FAVORITE_LINK[SUCCESS],
      FAVORITE_LINK[FAILURE]
    ],
    shouldCallAPI: (state: AppState) => {
      const user = getCurrentUser(state);
      if (!user) {
        return false;
      }
      return !user.favoriteRepo.hasOwnProperty(repoId);
    },
    callAPI: () => {
      axios.post(`/repo/favorite/${repoId}`);
    }
  };
};
export const likeLink = (repoId: string) => {
  return {
    types: [LIKE_LINK[REQUEST], LIKE_LINK[SUCCESS], LIKE_LINK[FAILURE]],
    shouldCallAPI: (state: AppState) => {
      const user = getCurrentUser(state);
      if (!user) {
        return false;
      }
      return user.repoVote[repoId] !== 1;
    },
    callAPI: () => {
      axios.post(`/repo/like/${repoId}`);
    }
  };
};
export const dislikeLink = (repoId: string) => {
  return {
    types: [
      DISLIKE_LINK[REQUEST],
      DISLIKE_LINK[SUCCESS],
      DISLIKE_LINK[FAILURE]
    ],
    shouldCallAPI: (state: AppState) => {
      const user = getCurrentUser(state);
      if (!user) {
        return false;
      }
      return user.repoVote[repoId] !== -1;
    },
    callAPI: () => {
      axios.post(`/repo/dislike/${repoId}`);
    }
  };
};
