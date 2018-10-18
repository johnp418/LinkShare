import * as React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { compose, bindActionCreators } from "redux";
import styled from "styled-components";
import axios from "axios";
import * as actions from "../actions";
import {
  createErrorMessageSelector,
  createLoadingSelector
} from "../reducers/selectors";
import { Icon, Loading, BlueScreen } from "../components/global";
import {
  Section,
  SectionContainer,
  SectionContentContainer,
  SectionHeader
} from "../components/Section";
import { TreeNodeContainer } from "../components/Tree";
import * as R from "ramda";

import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import FolderIcon from "@material-ui/icons/Folder";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Collapse from "@material-ui/core/Collapse";

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

class RepositoryDetailView extends React.Component {
  fileInput = React.createRef();

  state = {
    // root: ["6a8478ee70e67b007cc3ffb1276b3a12377cb036d90c3dcb22681e7e3c68bbc3"],
    // repository: data.repository,
    // link: data.link,
    dirty: false
  };

  componentDidMount() {
    this.props.fetchRepository(this.props.match.params.repositoryId);
  }

  renderNode(node) {
    // console.log("Node ", node);

    return (
      <TreeNodeContainer
        key={node.id}
        node={node}
        render={props => {
          const { type } = node;

          return (
            <List component="nav">
              <ListItem divider button onClick={this.handleClick}>
                {props.isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}

                <ListItemIcon>
                  {type === "folder" ? (
                    props.isOpen ? (
                      <FolderOpenIcon />
                    ) : (
                      <FolderIcon />
                    )
                  ) : (
                    <img src={this.props.links[node.linkId].icon} />
                  )}
                </ListItemIcon>
                <ListItemText inset>
                  {type === "folder" ? (
                    `${node.title} (${node.children.length})`
                  ) : (
                    <a href={this.props.links[node.linkId].url}>{node.title}</a>
                  )}
                </ListItemText>
                <ThumbUpIcon />
                <ThumbDownIcon />
              </ListItem>
              <Collapse in={props.isOpen} timeout="auto" unmountOnExit>
                {node.children &&
                  node.children.map(childId => {
                    const child = this.props.repositoryNodes[childId];
                    return this.renderNode(child);
                  })}
              </Collapse>
            </List>
          );
        }}
      />
    );
  }

  handleImport = e => {
    console.log("File uploaded ", e.target.files[0]);
    this.props.importRepository(e.target.files[0]).then(() => {
      this.setState({ dirty: true });
    });
  };

  handleSaveRepository = e => {
    const { root, repositoryNodes, title, links } = this.props;
    this.props.updateRepository({
      id: this.props.match.params.repositoryId,
      root,
      repositoryNodes,
      links,
      title
    });
  };

  handleDeleteRepository = e => {
    this.props.deleteRepository(this.props.match.params.repositoryId);
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
                ? this.props.root.map(rootId => {
                    return this.renderNode(this.props.repositoryNodes[rootId]);
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

const mapStateToProps = (state, ownProps) => {
  console.log("State ", state);
  console.log("OwnProps ", ownProps);
  return {
    loading: loadingSelector(state),
    error: errorSelector(state),
    title: state.entity.activeRepository.title,
    root: state.entity.activeRepository.root,
    repositoryNodes: state.entity.repositoryNodes,
    links: state.entity.links
  };
};
const mapDispatchToProps = (dispatch, getState) => {
  return bindActionCreators(actions, dispatch);
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(RepositoryDetailView);
