import { RequestType } from "src/types";

export const REQUEST = "REQUEST";
export const SUCCESS = "SUCCESS";
export const FAILURE = "FAILURE";

// Creates a request type object
export const createRequestTypes = (base: string): RequestType => {
  return [REQUEST, SUCCESS, FAILURE].reduce(
    (acc, type) => {
      acc[type] = `${base}_${type}`;
      return acc;
    },
    {} as RequestType
  );
};
