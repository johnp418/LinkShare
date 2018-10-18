import * as React from "react";
import { Link, withRouter } from "react-router-dom";
import styled from "styled-components";
import { Icon } from "../components/global";
import { Auth } from "aws-amplify";

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
const MenuButtonContainer = styled.div`
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

class Navbar extends React.Component {
  state = {};

  async componentDidMount() {
    const userInfo = await Auth.currentUserInfo();
    if (userInfo) {
      console.log("UserInfo ", userInfo);
      this.setState({ user: userInfo });
    }
  }

  render() {
    if (this.props.location.pathname.includes("/auth")) {
      return null;
    }
    console.log("Navbar ", this.props);

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
          </MenuButtonContainer>
          <MenuButtonContainer>
            {this.state.userInfo && (
              <MenuButton>
                <button
                  onClick={() => {
                    // Auth.onClick
                    // Auth.signOut()
                    //   .then(data => {
                    //     console.log("Hello bitch ", data);
                    //   })
                    //   .catch(err => {
                    //     console.log("Fail to sign out", err);
                    //   });
                  }}
                >
                  Sign Out
                </button>
              </MenuButton>
            )}
            <MenuButton>
              {this.state.userInfo ? (
                <button>UserName here</button>
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

export default withRouter(Navbar);
