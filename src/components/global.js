// @flow
import * as React from "react";
import styled, { keyframes } from "styled-components";
import { AxiosError } from "axios";

import CircularProgress from "@material-ui/core/CircularProgress";
import { Section } from "./Section";

const LoadingContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;
export const Loading = () => (
  <LoadingContainer>
    <CircularProgress />
  </LoadingContainer>
);

export const Icon = props => {
  // const StyledIcon = styled.i`
  // `
  return <i className="material-icons">{props.type}</i>;
};

// Props error type
export const BlueScreen = (props: { error: AxiosError }) => {
  const { error } = props;
  return (
    <Section>
      <div style={{ color: "red" }}>
        Something went wrong. Error:{" "}
        {/* {(error.response && error.response.data) || error.toString()} */}
      </div>
    </Section>
  );
};
