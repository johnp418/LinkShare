import * as React from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import styled from "styled-components";
import { Icon } from "../components/global";
import { History, Location } from "history";

import { IconButton } from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { connect } from "react-redux";
import { AppState, CurrentUser } from "src/types";
import { getCurrentUser } from "src/reducers/selectors";
import { bindActionCreators, Dispatch } from "redux";
import { signOut } from "src/actions/user";
// import { Auth } from "aws-amplify";

const NavbarContainer = styled.nav`
  display: flex;
  width: 64px;
  height: 100%;
  position: fixed;
  flex-direction: column;
  background-color: rgb(7, 71, 166);
`;

const Menu = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: 16px 0px;
`;
// styled.div<{ color?: string }>`
//   color: ${p => p.color || 'red'}
// `;
const MenuButtonContainer = styled.div<{ grow?: boolean }>`
  /* flex: 1; */
  ${props => props.grow && `flex: 1`};
`;
const MenuButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  border-radius: 50%;

  :hover {
    background-color: rgba(9, 30, 66, 0.42);
  }
`;
const StyledLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  width: 40px;
  height: 40px;
  text-decoration: none;
  /* cursor: pointer; */
`;

interface Props {
  currentUser: CurrentUser;
  signOut: () => void;
}

class Navbar extends React.Component<Props & RouteComponentProps> {
  render() {
    // console.log("Navbar ", this.props);

    return (
      <NavbarContainer>
        <Menu>
          <MenuButtonContainer grow>
            <MenuButton>
              <StyledLink to="/">
                <Icon type="view_list" />
              </StyledLink>
            </MenuButton>
            <MenuButton>
              <StyledLink to="/repo/create">
                <Icon type="add" />
              </StyledLink>
            </MenuButton>
            <IconButton>
              <FavoriteIcon />
            </IconButton>
          </MenuButtonContainer>
          <MenuButtonContainer>
            {/* {this.state.userInfo && (
              <MenuButton>
                <button
                  onClick={() => {

                  }}
                >
                  Sign Out
                </button>
              </MenuButton>
            )} */}
            <MenuButton>
              {this.props.currentUser ? (
                <button onClick={this.props.signOut}>UserName here</button>
              ) : (
                <StyledLink to="/auth/login">Sign In</StyledLink>
              )}
            </MenuButton>
          </MenuButtonContainer>
        </Menu>
      </NavbarContainer>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    currentUser: getCurrentUser(state)
  };
};
const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      signOut
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)((withRouter as any)(Navbar));
