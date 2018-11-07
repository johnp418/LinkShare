import { AxiosError, AxiosPromise } from "axios";

// interface ActionType

export interface AppState {
  entity: {
    repositories: RepositoryMap;
    repositoryNodes: RepositoryNodeMap;
    links: LinkMap;
  };
  activeRepository: {
    id: string;
    root: string[];
    title: string;
    userId: string;
  };
  ui: {
    loading: {
      [ActionType: string]: boolean;
    };
  };
  currentUser: CurrentUser | null;
}

export interface CurrentUser {
  username: string;
  email: string;
  favoriteRepo: {
    [repoId: string]: boolean;
  };
  repoVote: {
    [repoId: string]: number;
  };
  linkVote: {
    [linkId: string]: number;
  };
}

export interface LinkMap {
  [linkId: string]: Link;
}

export interface RepositoryNodeMap {
  [repositoryId: string]: RepositoryNode;
}

export interface RepositoryMap {
  byId: {
    [id: string]: Repository;
  };
  allIds: string[];
}

export interface Link {
  id: string;
  url: string;
  icon: string;
  popularity: number;
  like: number;
  dislike: number;
}

export interface Repository {
  id: string;
  userId: string;
  title: string;
  like: number;
  dislike: number;
  addDate: Date;
  lastModified: Date;
}

export interface RepositoryNode {
  id: string;
  title: string;
  parentId: string | null;
  addDate: Date;
  lastModified: Date;
  type: "folder" | "bookmark";
  children: string[];
  linkId: string;
}

// export interface RepositoryFolder extends RepositoryNode {
//   type: "folder";
//   children: string[];
// }
// export interface RepositoryBookmark extends RepositoryNode {
//   type: "bookmark";
//   linkId: string;
// }

// API related types
export interface RequestType {
  REQUEST: string;
  SUCCESS: string;
  FAILURE: string;
}

export interface APIProps {
  loading?: boolean;
  error: string;
}

export interface ApiAction {
  types: string[];
  callAPI: () => AxiosPromise;
  shouldCallAPI: (state: AppState) => boolean;
  payload: object;
  redirectTo: string;
}
