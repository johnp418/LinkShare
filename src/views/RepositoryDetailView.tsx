import * as React from "react";
import { connect } from "react-redux";
import { compose, bindActionCreators, Dispatch } from "redux";
import styled from "styled-components";
import * as actions from "../actions";
import {
  createErrorMessageSelector,
  createLoadingSelector,
  getActiveRepository
} from "../reducers/selectors";
import {
  //  Icon,
  Loading
  // BlueScreen
} from "../components/global";
import {
  Section,
  SectionContainer,
  SectionContentContainer,
  SectionHeader
} from "../components/Section";
// import * as R from "ramda";

import Button from "@material-ui/core/Button";
// import { withStyles } from "@material-ui/core/styles";
// import ExpansionPanel from "@material-ui/core/ExpansionPanel";
// import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
// import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
// import Typography from "@material-ui/core/Typography";

// import Avatar from "@material-ui/core/Avatar";
// import IconButton from "@material-ui/core/IconButton";
// import FormGroup from "@material-ui/core/FormGroup";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
// import Grid from "@material-ui/core/Grid";
import { RouteComponentProps } from "react-router-dom";
import { LinkMap, RepositoryNodeMap, AppState } from "src/types";
import RepositoryNode from "./RepositoryNode";

// const TreeNodeInfo = styled.div`
//   display: flex;
//   align-items: center;
//   min-height: 24px;
//   padding: 0.25em 0 0.25em 0;

//   :hover {
//     background-color: red;
//   }
// `;

// const TreeNodeContent = styled.ul`
//   ::before {
//     content: "";
//   }

//   padding: 0em 0 0em 1em;
// `;

// const TreeNodeTitle = styled.div`
//   /* flex: 1; */
//   margin-left: 0.5em;
// `;

const ButtonContainer = styled.div`
  margin-left: auto;
`;

interface MatchParams {
  repositoryId: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  loading: boolean;
  links: LinkMap;
  repositoryNodes: RepositoryNodeMap;
  root: string[];
  title: string;
  fetchRepository: any;
  importRepository: any;
  deleteRepository: any;
  updateRepository: any;
}

class RepositoryDetailView extends React.Component<
  Props & RouteComponentProps
> {
  fileInput = React.createRef<HTMLInputElement>();

  state = {
    // root: ["6a8478ee70e67b007cc3ffb1276b3a12377cb036d90c3dcb22681e7e3c68bbc3"],
    // repository: data.repository,
    // link: data.link,
    dirty: false
  };

  componentDidMount() {
    this.props.fetchRepository(this.props.match.params.repositoryId);
  }

  handleImport = (e: any) => {
    console.log("File uploaded ", e.target.files[0]);
    this.props.importRepository(e.target.files[0]).then(() => {
      this.setState({ dirty: true });
    });
  };

  handleSaveRepository = (e: any) => {
    const { root, repositoryNodes, title, links } = this.props;
    this.props.updateRepository({
      id: this.props.match.params.repositoryId,
      root,
      repositoryNodes,
      links,
      title
    });
  };

  handleDeleteRepository = (e: any) => {
    this.props.deleteRepository(this.props.match.params.repositoryId);
    // .then(() => {});
  };

  render() {
    console.log("RepositoryDetailView Props ", this.props);
    console.log("Repo State ", this.state);
    return (
      <Section>
        <SectionContainer>
          <SectionHeader>
            <div>{this.props.title}</div>
            <ButtonContainer>
              <input
                id="contained-button-file"
                style={{ display: "none" }}
                type="file"
                // className={classes.input}
                onChange={this.handleImport}
                ref={this.fileInput}
              />
              <label htmlFor="contained-button-file">
                <Button
                  variant="contained"
                  component="span"
                  //  className={classes.button}
                >
                  Import
                </Button>
              </label>
              <Button
                variant="contained"
                color="secondary"
                onClick={this.handleDeleteRepository}
              >
                Delete repository
              </Button>
              {this.state.dirty && (
                <Button variant="contained" onClick={this.handleSaveRepository}>
                  Save
                </Button>
              )}
            </ButtonContainer>
          </SectionHeader>
          {this.props.loading ? (
            <Loading />
          ) : (
            <SectionContentContainer>
              {this.props.root.length > 0
                ? this.props.root.map((rootId: string) => {
                    return (
                      <RepositoryNode
                        key={rootId}
                        repositoryNodes={this.props.repositoryNodes}
                        links={this.props.links}
                        node={this.props.repositoryNodes[rootId]}
                      />
                    );
                  })
                : "Empty repository"}
            </SectionContentContainer>
          )}
        </SectionContainer>
      </Section>
    );
  }
}

const loadingSelector = createLoadingSelector([
  "FETCH_REPOSITORY",
  "UPDATE_REPOSITORY",
  "DELETE_REPOSITORY",
  "IMPORT_REPOSITORY"
]);
const errorSelector = createErrorMessageSelector([
  "FETCH_REPOSITORY",
  "UPDATE_REPOSITORY",
  "DELETE_REPOSITORY",
  "IMPORT_REPOSITORY"
]);

const mapStateToProps = (state: AppState, ownProps: Props) => {
  console.log("State ", state);
  console.log("OwnProps ", ownProps);
  const activeRepository = getActiveRepository(state);
  return {
    loading: loadingSelector(state),
    error: errorSelector(state),
    title: activeRepository.title,
    root: activeRepository.root,
    repositoryNodes: state.entity.repositoryNodes,
    links: state.entity.links
  };
};
const mapDispatchToProps = (dispatch: Dispatch, getState: () => AppState) => {
  return bindActionCreators(actions as any, dispatch);
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(RepositoryDetailView);
