import axios from "axios";
import * as BookmarkParser from "../helpers/bookmarkParser";

const REQUEST = "REQUEST";
const SUCCESS = "SUCCESS";
const FAILURE = "FAILURE";

// Creates a request type object
const createRequestTypes = base => {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
    acc[type] = `${base}_${type}`;
    return acc;
  }, {});
};

export const FETCH_REPOSITORY = createRequestTypes("FETCH_REPOSITORY");
export const FETCH_REPOSITORIES = createRequestTypes("FETCH_REPOSITORIES");
export const UPDATE_REPOSITORY = createRequestTypes("UPDATE_REPOSITORY");
export const DELETE_REPOSITORY = createRequestTypes("DELETE_REPOSITORY");
export const IMPORT_REPOSITORY = createRequestTypes("IMPORT_REPOSITORY");

export const fetchRepository = repoId => {
  return dispatch => {
    dispatch({ type: FETCH_REPOSITORY[REQUEST] });
    return axios.get(`/repo/${repoId}`).then(
      response => {
        dispatch({ type: FETCH_REPOSITORY[SUCCESS], payload: response.data });
      },
      error => {
        dispatch({ type: FETCH_REPOSITORY[FAILURE], payload: error });
      }
    );
  };
};

export const fetchRepositories = () => {
  return dispatch => {
    dispatch({ type: FETCH_REPOSITORIES[REQUEST] });
    return axios.get("/repo").then(
      response => {
        dispatch({ type: FETCH_REPOSITORIES[SUCCESS], payload: response.data });
      },
      error => {
        dispatch({ type: FETCH_REPOSITORIES[FAILURE], payload: error });
      }
    );
  };
};

export const updateRepository = data => {
  const { id, repositoryNodes, links, title, root } = data;
  return (dispatch, getState) => {
    dispatch({
      type: UPDATE_REPOSITORY[SUCCESS]
    });
    // console.log("DATAAAA ", data);
    // return axios
    //   .post(`/repo/${data.id}`, {
    //     id,
    //     title,
    //     root,
    //     link: links,
    //     repository: repositoryNodes
    //   })
    //   .then(
    //     response => {
    //       dispatch({
    //         type: UPDATE_REPOSITORY[SUCCESS]
    //       });
    //     },
    //     error => {
    //       dispatch({ type: UPDATE_REPOSITORY[FAILURE], payload: error });
    //     }
    //   );
  };
};

export const deleteRepository = repoId => {
  return (dispatch, getState) => {
    dispatch({ type: DELETE_REPOSITORY[REQUEST] });
    return axios.delete(`/repo/${repoId}`).then(
      response => {
        dispatch({ type: DELETE_REPOSITORY[SUCCESS] });
      },
      error => {
        dispatch({ type: DELETE_REPOSITORY[FAILURE], payload: error });
      }
    );
  };
};

export const importRepository = (file, repoId) => {
  return dispatch => {
    dispatch({ type: IMPORT_REPOSITORY[REQUEST] });
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onerror = () => {
        fileReader.abort();
        reject(new DOMException("Problem parsing input file."));
      };
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.readAsText(file);
    })
      .then(contentString => {
        return BookmarkParser.parse(contentString, repoId);
      })
      .then(parsed => {
        console.log("Parsed Bookmark ", parsed);
        // const { title, root, repository, link } = parsed;
        dispatch({ type: IMPORT_REPOSITORY[SUCCESS], payload: parsed });
      })
      .catch(error => {
        dispatch({ type: IMPORT_REPOSITORY[FAILURE], payload: error });
      });
  };
};
