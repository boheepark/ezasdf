import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Signout extends Component {

  componentDidMount() {
    this.props.signout();
  };

  render() {
    return (
      <div>
        <p>You are now signed out. Click <Link to="/signin">here</Link> to sign back in.</p>
      </div>
    );
  };
};

export default Signout;
