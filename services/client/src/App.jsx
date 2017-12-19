import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import axios from 'axios';

import UserList from './components/UserList';
import About from './components/About';
import NavBar from './components/NavBar';
import AuthForm from './components/authForm/AuthForm';
import Signout from './components/Signout';
import Profile from './components/Profile';
import Message from './components/Message'


class App extends Component {

  constructor() {
    super();
    this.state = {
      users: [],
      title: 'ezasdf',
      isAuthenticated: false,
      messageText: null,
      messageType: null
    };
    this.signout = this.signout.bind(this);
    this.signin = this.signin.bind(this);
    this.createMessage = this.createMessage.bind(this);
    this.removeMessage = this.removeMessage.bind(this);
  };

  componentWillMount() {
    if (window.localStorage.getItem('token')) {
      this.setState({
        isAuthenticated: true
      });
    }
  };

  componentDidMount() {
    this.getUsers();
  };

  getUsers() {
    axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
    .then((res) => {
      this.setState({
        users: res.data.data.users
      });
    })
    .catch((err) => {
      console.log(err);
    });
  };

  signout() {
    window.localStorage.clear();
    this.setState({
      isAuthenticated: false
    });
  };

  signin(token) {
    window.localStorage.setItem('token', token);
    this.setState({
      isAuthenticated: true
    });
    this.getUsers();
    this.createMessage('Welcome!');
  };

  createMessage(text='Sanity Check', type='success') {
    this.setState({
      messageText: text,
      messageType: type
    });
    setTimeout(() => {
      this.removeMessage();
    }, 3000);
  };

  removeMessage() {
    this.setState({
      messageText: null,
      messageType: null
    });
  };

  render() {
    return (
      <div>
        <NavBar
          title={this.state.title}
          isAuthenticated={this.state.isAuthenticated}
        />
        <div className="container">
          {
            this.state.messageText && this.state.messageType &&
            <Message
              messageText={this.state.messageText}
              messageType={this.state.messageType}
              removeMessage={this.removeMessage}
            />
          }
          <div className="row">
            <div className="col-md-6">
              <br/>
              <Switch>
                <Route exact path='/' render={() => (
                  <UserList
                    users={this.state.users}
                  />
                )}/>
                <Route exact path='/about' component={About}/>
                <Route exact path='/signup' render={() => (
                  <AuthForm
                    form="signup"
                    isAuthenticated={this.state.isAuthenticated}
                    signin={this.signin}
                    createMessage={this.createMessage}
                  />
                )}/>
                <Route exact path='/signin' render={() => (
                  <AuthForm
                    form="signin"
                    isAuthenticated={this.state.isAuthenticated}
                    signin={this.signin}
                    createMessage={this.createMessage}
                  />
                )}/>
                <Route exact path='/signout' render={() => (
                  <Signout
                    isAuthenticated={this.state.isAuthenticated}
                    signout={this.signout}
                  />
                )}/>
                <Route exact path='/profile' render={() => (
                  <Profile
                    isAuthenticated={this.state.isAuthenticated}
                  />
                )}/>
              </Switch>
            </div>
          </div>
        </div>
      </div>
    );
  };
};

export default App;
