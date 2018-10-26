import * as React from "react";
import { connect } from "react-redux";
import {
  RepositoryNode as RepositoryNodeType,
  AppState,
  RepositoryNodeMap,
  LinkMap
} from "src/types";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FolderIcon from "@material-ui/icons/Folder";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import { TreeNodeContainer } from "../components/Tree";
import { createLoadingSelector } from "src/reducers/selectors";

interface Props {
  node: RepositoryNodeType;
  links: LinkMap;
  repositoryNodes: RepositoryNodeMap;
}

class RepositoryNode extends React.Component<Props> {
  render() {
    const { node, repositoryNodes, links } = this.props;

    if (!node) {
      return null;
    }

    const {
      id,
      linkId,
      title,
      type,
      children
      // addDate,
      // lastModified
    } = node;

    return (
      <TreeNodeContainer
        key={node.id}
        node={node}
        render={(props: any) => {
          return (
            <List component="nav">
              <ListItem
                className="john-list"
                divider
                button
                // onClick={this.handleClick}
              >
                {type === "folder" && (
                  <div className="john-list-toggle-button">
                    {props.isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </div>
                )}

                <div className="john-list-title">
                  <ListItemIcon>
                    {type === "folder" ? (
                      props.isOpen ? (
                        <FolderOpenIcon />
                      ) : (
                        <FolderIcon />
                      )
                    ) : (
                      <img src={links[linkId].icon} />
                    )}
                  </ListItemIcon>
                  <ListItemText inset>
                    {type === "folder" ? (
                      `${title} (${children.length})`
                    ) : (
                      <a href={links[linkId].url}>{title}</a>
                    )}
                  </ListItemText>
                </div>

                <div className="john-list-action-buttons">
                  <div className="john-list-action-button">
                    {type !== "folder" && (
                      <div>
                        {links[linkId].popularity}
                        <FavoriteIcon />
                      </div>
                    )}
                  </div>
                  <div className="john-list-action-button">
                    <ThumbUpIcon />
                  </div>
                  <div className="john-list-action-button">
                    <ThumbDownIcon />
                  </div>
                </div>
              </ListItem>
              {type === "folder" && (
                <Collapse in={props.isOpen} timeout="auto" unmountOnExit>
                  {children &&
                    children.map((childId: string) => {
                      return (
                        <RepositoryNode
                          key={childId}
                          repositoryNodes={repositoryNodes}
                          links={links}
                          node={repositoryNodes[childId]}
                        />
                      );
                    })}
                </Collapse>
              )}
            </List>
          );
        }}
      />
    );
  }
}

// const loadingSelector = createLoadingSelector([]);
// const errorSelector = createErrorMessageSelector([
// ]);
// const mapStateToProps = (state: AppState, ownProps: Props): StateProps => {
//   console.log("State ", state);
//   console.log("OwnProps ", ownProps);
//   return {
//     // error: errorSelector(state),
//     // repositoryNodes: state.entity.repositoryNodes,
//     // links: state.entity.links
//   };
// };

// const mapDispatchToProps = (dispatch: Dispatch, getState: () => AppState) => {
//   return bindActionCreators(actions as any, dispatch);
// };

export default connect()(RepositoryNode);
// mapStateToProps,
// mapDispatchToProps,
// null
