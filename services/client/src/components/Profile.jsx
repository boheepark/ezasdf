import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: '',
      email: '',
      username: '',
      active: '',
      admin: '',
      created_at: ''
    };
  };

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.getProfile();
    }
  };

  getProfile() {
    return axios({
      url: `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/profile`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.localStorage.token}`
      }
    })
    .then((res) => {
      this.setState({
        id: res.data.data.id,
        username: res.data.data.username,
        email: res.data.data.email,
        active: String(res.data.data.active),
        admin: String(res.data.data.admin),
        created_at: res.data.data.created_at,
      });
    })
    .catch((error) => {
      console.log(error);
    });
  };

  render() {
    if (!this.props.isAuthenticated) {
      return (
        <p>You must be signed in to view this page. Click <Link to="/signin">here</Link> to sign in.</p>
      );
    }
    return (
      <div>
        <ul>
          <li><strong>User ID:</strong> {this.state.id}</li>
          <li><strong>Username:</strong> {this.state.username}</li>
          <li><strong>Email:</strong> {this.state.email}</li>
          <li><strong>Active:</strong> {this.state.active}</li>
          <li><strong>Admin:</strong> {this.state.admin}</li>
          <li><strong>Created at:</strong> {this.state.created_at}</li>
        </ul>
      </div>
    );
  };
};

export default Profile;
