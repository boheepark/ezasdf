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
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  };

  componentDidMount() {
    this.clearForm();
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.form !== nextProps.form) {
      this.clearForm();
      this.resetRules();
      // this.initRules();
    }
  };

  handleChange(event) {
    const data = this.state.data;
    data[event.target.name] = event.target.value;
    this.setState(data);
    this.validateForm();
  };

  handleSubmit(event) {
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
      this.props.signin(res.data.data.token);
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

  clearForm() {
    this.setState({
      data: {
        username: '',
        email: '',
        password: ''
      }
    });
  };


  allTrue() {
    let rules;
    if(this.props.form === 'signup') {
      rules = signupRules;
    } else if(this.props.form === 'signin') {
      rules = signinRules;
    }
    for (const rule of rules) {
      if (!rule.valid) {
        return false;
      }
    }
    return true;
  };

  // initRules() {
  //   const rules = this.state.rules;
  //   for (const rule of rules) {
  //     rule.valid = false;
  //   }
  //   this.setState({
  //     rules: rules
  //   });
  // };

  resetRules() {
    if(this.props.form === 'signin') {
      const rules = this.state.signinRules;
      for(const rule of rules) {
        rule.valid = false;
      }
      this.setState({
        signinRules: rules
      });
    } else if(this.props.form === 'signup') {
      const rules = this.state.signupRules;
      for(const rule of rules) {
        rule.valid = false;
      }
      this.setState({
        signupRules: rules
      });
    }
    this.setState({
      valid: false
    });
  };

  validateEmail(email) {
    // eslint-disable-next-line
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  validateForm() {
    const data = this.state.data;

    this.resetRules();

    if(this.props.form === 'signup') {
      const rules = this.state.signupRules;
      if(data.username.length > 5) {
        rules[0].valid = true;
      }
      if(data.email.length > 5) {
        rules[1].valid = true;
      }
      if(this.validateEmail(data.email)) {
        rules[2].valid = true;
      }
      if(data.password.length > 10) {
        rules[3].valid = true;
      }
      this.setState({
        signupRules: rules
      });
      if(this.allTrue()) {
        this.setState({
          valid: true
        });
      }
    } else if(this.props.form === 'signin') {
      const rules = this.state.signinRules;
      if(data.email.length > 0) {
        rules[0].valid = true;
      }
      if(data.password.length > 0) {
        rules[1].valid = true;
      }
      this.setState({
        signinRules: rules
      });
      if(this.allTrue()) {
        this.setState({
          valid: true
        });
      }
    }
  };

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to='/'/>;
    }
    let rules;
    if(this.props.form === 'signup') {
      rules = this.state.signupRules;
    } else if (this.props.form === 'signin') {
      rules = this.state.signinRules;
    }
    return (
      <div>
        <h1 style={{'textTransform': 'capitalize'}}>{this.props.form}</h1>
        <hr/>
        <br/>
        <AuthFormErrors
          form={this.props.form}
          rules={rules}
        />
        <form onSubmit={(event) => this.handleSubmit(event)}>
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
                onChange={this.handleChange}
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
              onChange={this.handleChange}
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
              onChange={this.handleChange}
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
