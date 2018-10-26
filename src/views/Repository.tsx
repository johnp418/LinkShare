// @flow
import * as React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { compose, Dispatch, bindActionCreators } from "redux";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import StarIcon from "@material-ui/icons/Star";
import {
  Repository as RepositoryType,
  AppState,
  CurrentUser,
  APIProps
} from "src/types";
import { withStyles, Theme, IconButton } from "@material-ui/core";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import FavoriteIcon from "@material-ui/icons/Favorite";
import {
  getRepository,
  getCurrentUser,
  createLoadingSelector,
  createErrorMessageSelector
} from "src/reducers/selectors";
import {
  favoriteRepository,
  likeRepository,
  dislikeRepository
} from "src/actions/repository";
import { push } from "connected-react-router";
import {
  GET_USER_DATA,
  USER_SIGN_IN,
  SET_CURRENT_USER
} from "src/actions/user";

const styles = (theme: Theme) => ({
  // button: {
  //   margin: theme.spacing.unit
  // },
  input: {
    display: "none"
  }
});

interface Props {
  classes: any;
  id: string;
  loading: boolean;
  error: any;
  currentUser: CurrentUser;
  dispatch: Dispatch;
  repository: RepositoryType;
  favoriteRepository: Function;
  likeRepository: Function;
  dislikeRepository: Function;
  redirectTo: (path: string) => void;
}

class Repository extends React.Component<Props & APIProps> {
  handleFavorite = () => {
    // If user isn't signed in, redirect to login
    const { id, currentUser, favoriteRepository, redirectTo } = this.props;
    if (!currentUser) {
      redirectTo("/auth/login");
      return;
    }
    favoriteRepository(id);
  };
  handleLike = () => {
    const { id, currentUser, likeRepository, redirectTo } = this.props;
    if (!currentUser) {
      redirectTo("/auth/login");
      return;
    }
    likeRepository(id);
  };
  handleDislike = () => {
    const { id, currentUser, dislikeRepository, redirectTo } = this.props;
    if (!currentUser) {
      redirectTo("/auth/login");
      return;
    }
    dislikeRepository(id);
  };

  render() {
    const { loading, error, repository } = this.props;
    if (loading) {
      return "Loading...";
    }
    const {
      id,
      userId,
      title,
      like,
      dislike,
      addDate,
      lastModified
    } = repository;
    // TODO: Show like / dislike button / date

    const { classes } = this.props;

    console.log("Repository Props ", this.props);

    return (
      <ListItem>
        <ListItemIcon>
          <IconButton>
            <StarIcon fontSize="small" />
          </IconButton>
        </ListItemIcon>
        <ListItemText inset>
          <Link to={`/list/${id}`}>
            {title} - {userId}
          </Link>
          <span>uploaded on {addDate}</span>
          <span>last update {lastModified}</span>
        </ListItemText>
        <div>
          <IconButton
            onClick={this.handleFavorite}
            className={classes.button}
            aria-label="Delete"
          >
            <FavoriteIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={this.handleLike}
            className={classes.button}
            aria-label="Delete"
          >
            <ThumbUpIcon fontSize="small" />
            {like}
          </IconButton>
          <IconButton
            onClick={this.handleDislike}
            className={classes.button}
            aria-label="Delete"
          >
            <ThumbDownIcon fontSize="small" />
            {dislike}
          </IconButton>
        </div>
      </ListItem>
    );
  }
}

const loadingSelector = createLoadingSelector([
  GET_USER_DATA,
  SET_CURRENT_USER
]);
const errorSelector = createErrorMessageSelector([
  GET_USER_DATA,
  SET_CURRENT_USER
]);
const mapStateToProps = (state: AppState, ownProps: { id: string }) => {
  const { id } = ownProps;
  const currentUser = getCurrentUser(state);
  return {
    id,
    loading: loadingSelector(state),
    error: errorSelector(state),
    repository: getRepository(state, ownProps.id),
    currentUser
    // canFavorite:
    //   currentUser &&
    //   currentUser.favoriteRepo &&
    //   currentUser.favoriteRepo.hasOwnProperty(id),
    // canLike: currentUser && currentUser.repoVote[id] !== 1,
    // canDislike: currentUser && currentUser.repoVote[id] !== -1
  };
};
const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      favoriteRepository,
      likeRepository,
      dislikeRepository,
      redirectTo: push
    },
    dispatch
  );
};
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(Repository);
