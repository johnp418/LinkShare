// @flow
import * as React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import Repository from "./Repository";
import { fetchRepositories } from "../actions";
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

const styles = theme => {
  console.log("Theme => ", theme);
  return {
    progress: {
      margin: theme.spacing.unit * 2
    }
  };
};

class RepositoryList extends React.Component<any> {
  componentDidMount() {
    console.log("RepositoryList mount fetch ");
    this.props.fetchRepositories();
  }

  render() {
    const { classes } = this.props;
    if (this.props.error) {
      return <BlueScreen error={this.props.error} />;
    }
    console.log("Props ", this.props);

    return (
      <Section>
        <SectionContainer>
          <SectionHeader>Repository</SectionHeader>
          {this.props.loading && <Loading />}
          {!this.props.loading && (
            <SectionContentContainer>
              <List>
                {this.props.repositories.allIds.length <= 0 ? (
                  <ListItemText inset>
                    There is no repository in the system
                  </ListItemText>
                ) : (
                  this.props.repositories.allIds.map(id => {
                    return (
                      <Repository
                        key={id}
                        {...this.props.repositories.byId[id]}
                      />
                    );
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

const mapStateToProps = state => ({
  // loading: loadingSelector(state),
  loading: loadingSelector(state),
  error: errorSelector(state),
  repositories: state.entity.repositories
});
const mapDispatchToProps = (dispatch, getState) => {
  return {
    fetchRepositories: () => dispatch(fetchRepositories())
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(RepositoryList);
