import React, {Component} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import {signupRules, signinRules} from './authForm-rules';
import AuthFormErrors from "./AuthFormErrors";


class AuthForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {
        username: '',
        email: '',
        password: ''
      },
      signupRules: signupRules,
      signinRules: signinRules,
      valid: false
    };
    this.handleUserFormSubmit = this.handleUserFormSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
  };

  clearForm() {
    this.setState({
      data: {
        username: '',
        email: '',
        password: ''
      }
    });
  };

  initRules() {
    const rules = this.state.rules;
    for (const rule of rules) {
      rule.valid = false;
    }
    this.setState({
      formRules: rules
    });
  };

  allTrue() {
    for (const rule of this.state.rules) {
      if (!rule.valid) {
        return false;
      }
    }
    return true;
  };

  validateEmail(email) {
    // eslint-disable-next-line
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  validateForm() {
    const form = this.props.form;
    const rules = this.state.rules;
    const data = this.state.data;
    this.setState({
      valid: false
    });
    for (const rule of rules) {
      rule.valid = false;
    }
    if (form === 'signup') {
      if (data.username.length > 5) {
        rules[0].valid = true;
      }
    }
    if (form === 'signin') {
      rules[0].valid = true;
    }
    if (data.email.length > 5) {
      rules[1].valid = true;
    }
    if (this.validateEmail(data.email)) {
      rules[2].valid = true;
    }
    if (data.password.length > 10) {
      rules[3].valid = true;
    }
    this.setState({
      rules: rules
    });
    if (this.allTrue()) {
      this.setState({
        valid: true
      });
    }
  };

  handleFormChange(event) {
    const data = this.state.data;
    data[event.target.name] = event.target.value;
    this.setState(data);
    this.validateForm();
  };

  handleUserFormSubmit(event) {
    event.preventDefault();
    const form = this.props.form;
    let data;
    if (form === 'signin') {
      data = {
        email: this.state.data.email,
        password: this.state.data.password
      };
    } else if (form === 'signup') {
      data = {
        username: this.state.data.username,
        email: this.state.data.email,
        password: this.state.data.password
      };
    }
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/${form}`;
    axios.post(url, data)
    .then((res) => {
      this.clearForm();
      this.props.signinUser(res.data.data.token);
    })
    .catch((err) => {
      console.log(err);
      this.props.createMessage(`${form} failed.`, 'danger');
      // if(form === 'signin') {
      //   this.props.createMessage('Signin failed.', 'danger');
      // }
      // if(form === 'signup') {
      //   this.props.createMessage('Signup failed.', 'danger');
      // }
    });
  };

  componentDidMount() {
    this.clearForm();
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.form !== nextProps.form) {
      this.clearForm();
      this.initRules();
    }
  };

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to='/'/>;
    }
    let rules = eval(`this.state.${this.props.form}Rules`);
    return (
      <div>
        <h1 style={{'textTransform': 'capitalize'}}>{this.props.form}</h1>
        <hr/>
        <br/>
        <AuthFormErrors
          form={this.props.form}
          rules={rules}
        />
        <form onSubmit={(event) => this.handleUserFormSubmit(event)}>
          {
            this.props.form === 'signup' &&
            <div className="form-group">
              <input
                name="username"
                className="form-control input-lg"
                type="text"
                placeholder="Enter a username"
                required
                value={this.state.data.username}
                onChange={this.handleFormChange}
              />
            </div>
          }
          <div className="form-group">
            <input
              name="email"
              className="form-control input-lg"
              type="email"
              placeholder="Enter an email address"
              required
              value={this.state.data.email}
              onChange={this.handleFormChange}
            />
          </div>
          <div className="form-group">
            <input
              name="password"
              className="form-control input-lg"
              type="password"
              placeholder="Enter a password"
              required
              value={this.state.data.password}
              onChange={this.handleFormChange}
            />
          </div>
          <input
            type="submit"
            className="btn btn-secondary btn-lg btn-block"
            value="Submit"
            disabled={!this.state.valid}
          />
        </form>
      </div>
    );
  };
};

export default AuthForm;
