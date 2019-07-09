import React, { Component } from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'

class RegisterPage extends Component {
  state = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  };

  registerUser = (event) => {
    event.preventDefault();

    if (this.state.username && this.state.password) {
      this.props.dispatch({
        type: 'REGISTER',
        payload: {
          username: this.state.username,
          password: this.state.password,
        },
      });
    } else {
      this.props.dispatch({ type: 'REGISTRATION_INPUT_ERROR' });
    }
  } // end registerUser

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  render() {
    return (
      <Grid id="loginWrapper" container justify="center">
        {this.props.errors.registrationMessage && (
          <h2
            className="alert"
            role="alert"
          >
            {this.props.errors.registrationMessage}
          </h2>
        )}

        <Grid container item xs={9} id="loginForm" className="grid-item-text-center">
          <form autoComplete="off" onSubmit={this.registerUser}>
            <h1>Register</h1>
            <TextField
              fullWidth
              id="username"
              label="Username"
              value={this.state.username}
              onChange={this.handleInputChangeFor('username')}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              id="password"
              label="Password"
              type="password"
              value={this.state.password}
              onChange={this.handleInputChangeFor('password')}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              id="firstName"
              label="First Name"
              type="text"
              value={this.state.firstName}
              onChange={this.handleInputChangeFor('firstName')}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              id="lastName"
              label="Last Name"
              type="text"
              value={this.state.lastName}
              onChange={this.handleInputChangeFor('lastName')}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              id="email"
              label="Email Address"
              type="text"
              value={this.state.email}
              onChange={this.handleInputChangeFor('email')}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              id="phone"
              label="Phone Number"
              type="text"
              value={this.state.phone}
              onChange={this.handleInputChangeFor('phone')}
              margin="normal"
            />
            <Grid item xs={12}>
              <Button className="submit-button" variant="contained" color="primary" type="submit">Register</Button>
            </Grid>
          </form>
          <Grid className="grid-item-text-center" item xs={12}>
            <Button
              type="button"
              onClick={() => { this.props.dispatch({ type: 'SET_TO_LOGIN_MODE' }) }}
            >
              Log In
          </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

// Instead of taking everything from state, we just want the error messages.
// if you wanted you could write this code like this:
// const mapStateToProps = ({errors}) => ({ errors });
const mapStateToProps = state => ({
  errors: state.errors,
});

export default connect(mapStateToProps)(RegisterPage);

