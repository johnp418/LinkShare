// @flow
import * as React from "react";
import { Link } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import StarIcon from "@material-ui/icons/Star";

// AddDate: "2018-10-10T01:11:22.597Z"
// Dislike: 0
// Id: "1e92cc41af73454df3f58a56918053d4f8679d742c1f04240660175244ea670f"
// LastModified: "2018-10-10T01:11:22.597Z"
// Like: 0
// Title: "ez-backend"
// UserId: "John Park"

type RepositoryProps = {
  id: string,
  userId: string,
  title: string,
  like: number,
  dislike: number,
  addDate: Date,
  lastModified: Date
};

class Repository extends React.Component<RepositoryProps> {
  render() {
    const {
      id,
      userId,
      title,
      like,
      dislike,
      addDate,
      lastModified
    } = this.props;
    // TODO: Show like / dislike button / date
    return (
      <ListItem>
        <ListItemIcon>
          <StarIcon />
        </ListItemIcon>
        <ListItemText inset>
          <Link to={`/list/${id}`}>
            {title} - {userId}
          </Link>
        </ListItemText>
      </ListItem>
    );
  }
}

export default Repository;
