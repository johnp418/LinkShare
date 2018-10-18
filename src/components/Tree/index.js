import * as React from "react";
import styled from "styled-components";

const StyledTree = styled.ul`
  /* & ul {
    margin: 0 0 0 0.75em;
    padding: 0;
    position: relative;

    ::before {
      content: "";
      width: 0;
      position: absolute;
      top: 0
      left: 0
      bottom: 0
      border-left: 1px solid;
    }
  } */
`;

const Container = styled.li`
  list-style-type: none;
  position: relative;
  padding-left: 0.5em;
`;

export class TreeNodeContainer extends React.Component {
  state = {
    isOpen: true
  };
  handleClick = e => {
    e.stopPropagation();
    if (this.props.node.type === "folder") {
      this.setState(prev => ({ isOpen: !prev.isOpen }));
    }
  };
  render() {
    // console.log("Props ", this.props);
    return (
      <Container onClick={this.handleClick}>
        {this.props.render(this.state)}
      </Container>
    );
  }
}
