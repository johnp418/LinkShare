import axios from "axios";
import * as BookmarkParser from "../helpers/bookmarkParser";

// TODO: need better type
interface RequestType {
  REQUEST?: string;
  SUCCESS?: string;
  FAILURE?: string;
}

const REQUEST = "REQUEST";
const SUCCESS = "SUCCESS";
const FAILURE = "FAILURE";

// Creates a request type object
const createRequestTypes = (base: string): RequestType => {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
    acc[type] = `${base}_${type}`;
    return acc;
  }, {});
};

export const FETCH_REPOSITORY = createRequestTypes("FETCH_REPOSITORY");
export const FETCH_REPOSITORIES = createRequestTypes("FETCH_REPOSITORIES");
export const UPDATE_REPOSITORY = createRequestTypes("UPDATE_REPOSITORY");
export const DELETE_REPOSITORY = createRequestTypes("DELETE_REPOSITORY");
export const DELETE_REPOSITORY_LINK = createRequestTypes(
  "DELETE_REPOSITORY_LINK"
);
export const IMPORT_REPOSITORY = createRequestTypes("IMPORT_REPOSITORY");

// TODO: Write tests for action creators

export const fetchRepository = (repoId: string) => {
  return {
    types: [
      FETCH_REPOSITORY[REQUEST],
      FETCH_REPOSITORY[SUCCESS],
      FETCH_REPOSITORY[FAILURE]
    ],
    callAPI: () => axios.get(`/repo/${repoId}`)
  };
};

export const fetchRepositories = (repoId: string) => {
  return {
    types: [
      FETCH_REPOSITORIES[REQUEST],
      FETCH_REPOSITORIES[SUCCESS],
      FETCH_REPOSITORIES[FAILURE]
    ],
    callAPI: () => axios.get("/repo")
  };
};

export const updateRepository = (updateParams: {
  id: string;
  repositoryNodes: any;
  links: any;
  title: string;
  root: string[];
}) => {
  const { id, repositoryNodes, links, title, root } = updateParams;
  return {
    types: [
      UPDATE_REPOSITORY[REQUEST],
      UPDATE_REPOSITORY[SUCCESS],
      UPDATE_REPOSITORY[FAILURE]
    ],
    callAPI: () =>
      axios.post(`/repo/${id}`, {
        id,
        title,
        root,
        link: links,
        repository: repositoryNodes
      })
  };
};

export const deleteRepository = (repoId: string) => {
  return {
    types: [
      DELETE_REPOSITORY[REQUEST],
      DELETE_REPOSITORY[SUCCESS],
      DELETE_REPOSITORY[FAILURE]
    ],
    callAPI: () => axios.delete(`/repo/${repoId}`)
  };
};

export const deleteRepositoryLink = (repoId: string, linkId: string) => {
  return {
    types: [
      DELETE_REPOSITORY_LINK[REQUEST],
      DELETE_REPOSITORY_LINK[SUCCESS],
      DELETE_REPOSITORY_LINK[FAILURE]
    ],
    redirectTo: "/"
  };
};

export const importRepository = (file: any, repoId: string) => {
  return {
    types: [
      IMPORT_REPOSITORY[REQUEST],
      IMPORT_REPOSITORY[SUCCESS],
      IMPORT_REPOSITORY[FAILURE]
    ],
    callAPI: () => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onerror = () => {
          fileReader.abort();
          reject(new DOMException("Problem parsing input file."));
        };
        fileReader.onload = () => {
          const result = BookmarkParser.parse(fileReader.result, repoId);
          resolve({ data: result });
        };
        fileReader.readAsText(file);
      });
    }
  };
};

// export const fetchRepository = repoId => {
//   return dispatch => {
//     dispatch({ type: FETCH_REPOSITORY[REQUEST] });
//     return axios.get(`/repo/${repoId}`).then(
//       response => {
//         dispatch({ type: FETCH_REPOSITORY[SUCCESS], payload: response.data });
//       },
//       error => {
//         dispatch({ type: FETCH_REPOSITORY[FAILURE], payload: error });
//       }
//     );
//   };
// };

// export const fetchRepositories = () => {
//   return dispatch => {
//     dispatch({ type: FETCH_REPOSITORIES[REQUEST] });
//     return axios.get("/repo").then(
//       response => {
//         dispatch({ type: FETCH_REPOSITORIES[SUCCESS], payload: response.data });
//       },
//       error => {
//         dispatch({ type: FETCH_REPOSITORIES[FAILURE], payload: error });
//       }
//     );
//   };
// };

// export const updateRepository = data => {
//   const { id, repositoryNodes, links, title, root } = data;
//   return (dispatch, getState) => {
//     dispatch({
//       type: UPDATE_REPOSITORY[SUCCESS]
//     });
//     // console.log("DATAAAA ", data);
//     // return axios
//     //   .post(`/repo/${data.id}`, {
//     //     id,
//     //     title,
//     //     root,
//     //     link: links,
//     //     repository: repositoryNodes
//     //   })
//     //   .then(
//     //     response => {
//     //       dispatch({
//     //         type: UPDATE_REPOSITORY[SUCCESS]
//     //       });
//     //     },
//     //     error => {
//     //       dispatch({ type: UPDATE_REPOSITORY[FAILURE], payload: error });
//     //     }
//     //   );
//   };
// };

// export const deleteRepository = repoId => {
//   return (dispatch, getState) => {
//     dispatch({ type: DELETE_REPOSITORY[REQUEST] });
//     return axios.delete(`/repo/${repoId}`).then(
//       response => {
//         dispatch({ type: DELETE_REPOSITORY[SUCCESS] });
//       },
//       error => {
//         dispatch({ type: DELETE_REPOSITORY[FAILURE], payload: error });
//       }
//     );
//   };
// };

// export const importRepository = (file, repoId) => {
//   return dispatch => {
//     dispatch({ type: IMPORT_REPOSITORY[REQUEST] });
//     return new Promise((resolve, reject) => {
//       const fileReader = new FileReader();
//       fileReader.onerror = () => {
//         fileReader.abort();
//         reject(new DOMException("Problem parsing input file."));
//       };
//       fileReader.onload = () => {
//         resolve(fileReader.result);
//       };
//       fileReader.readAsText(file);
//     })
//       .then(contentString => {
//         return BookmarkParser.parse(contentString, repoId);
//       })
//       .then(parsed => {
//         console.log("Parsed Bookmark ", parsed);
//         // const { title, root, repository, link } = parsed;
//         dispatch({ type: IMPORT_REPOSITORY[SUCCESS], payload: parsed });
//       })
//       .catch(error => {
//         dispatch({ type: IMPORT_REPOSITORY[FAILURE], payload: error });
//       });
//   };
// };