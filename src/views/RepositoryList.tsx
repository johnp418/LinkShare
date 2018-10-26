// @flow
import * as React from "react";
import { connect } from "react-redux";
import { compose, Dispatch } from "redux";
import Repository from "./Repository";
import { fetchRepositories } from "src/actions/repository";
import {
  createLoadingSelector,
  createErrorMessageSelector
} from "../reducers/selectors";
import {
  Section,
  SectionContainer,
  SectionContentContainer,
  SectionHeader
} from "../components/Section";
import { BlueScreen, Loading } from "../components/global";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import { RouteComponentProps } from "react-router-dom";
import { APIProps, AppState, RepositoryMap } from "src/types";

const styles = (theme: any) => {
  // console.log("Theme => ", theme);
  return {
    progress: {
      margin: theme.spacing.unit * 2
    }
  };
};

interface Props {
  repositories: RepositoryMap;
  fetchRepositories: () => void;
}

class RepositoryList extends React.Component<
  Props & RouteComponentProps & APIProps
> {
  componentDidMount() {
    this.props.fetchRepositories();
  }

  render() {
    // const { classes } = this.props;
    const { loading, error, repositories } = this.props;
    if (error) {
      return <BlueScreen error={error} />;
    }
    console.log("RepositoryList Props ", this.props);

    return (
      <Section>
        <SectionContainer>
          <SectionHeader>Repository</SectionHeader>
          {loading && <Loading />}
          {!loading && (
            <SectionContentContainer>
              <List>
                {repositories.allIds.length <= 0 ? (
                  <ListItemText inset>
                    There is no repository in the system
                  </ListItemText>
                ) : (
                  repositories.allIds.map((id: string) => {
                    return <Repository key={id} {...repositories.byId[id]} />;
                  })
                )}
              </List>
            </SectionContentContainer>
          )}
        </SectionContainer>
      </Section>
    );
  }
}

// Show loading on FETCH_REPOSITORIES
const loadingSelector = createLoadingSelector(["FETCH_REPOSITORIES"]);
const errorSelector = createErrorMessageSelector(["FETCH_REPOSITORIES"]);

const mapStateToProps = (state: AppState) => ({
  loading: loadingSelector(state),
  error: errorSelector(state),
  repositories: state.entity.repositories
});
const mapDispatchToProps = (dispatch: Dispatch, getState: () => AppState) => {
  return {
    fetchRepositories: (id: any) => dispatch(fetchRepositories(id) as any)
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(RepositoryList);
