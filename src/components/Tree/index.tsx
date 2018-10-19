import * as React from "react";
import styled from "styled-components";

const Container = styled.li`
  list-style-type: none;
  position: relative;
  padding-left: 0.5em;
`;

interface Props {
  node: any;
  render: any;
}

interface State {
  isOpen: boolean;
}

export class TreeNodeContainer extends React.Component<Props, State> {
  state = {
    isOpen: true
  };
  handleClick = (e: any) => {
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
