import React, { Component } from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid'


// Components
import Header from '../Header'
import Footer from '../Footer/Footer';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'
// import LoginPage from '../LoginPage/LoginPage';
// import RegisterPage from '../RegisterPage/RegisterPage';

import Home from '../Home';
import MyPins from '../Pins';
import MyMeetups from '../Meetups';
import Profile from '../Profile';
import Organize from '../OrganizeMeetup'
import SingleMeetup from '../SingleMeetup'
import WelcomePage from '../WelcomePage'
import ErrorPage from '../ErrorPage'
import AdminView from '../Admin'


import './App.css';

class App extends Component {
  componentDidMount() {
    this.props.dispatch({ type: 'FETCH_USER' })
    this.props.dispatch({ type: 'CLEAR_SELECTED_PIN' })
  }

  render() {
    return (
      <Router>
        {/* Do not display the header and footer on the WelomePage route */}
        <Route path="/" render={(routerProps) => (routerProps.location.pathname !== "/welcome") && <Header {...routerProps} />} />
        <div className="app">
          {/* Wrap the the content in Grid to make sure it isn't too janky on desktop view */}
          <Grid container justify="center">
            <Grid item xs={12} md={9} lg={6}>
              <Switch>
                <Redirect exact from="/" to="/welcome" />
                <Route exact path="/welcome" component={WelcomePage} />
                {/* For protected routes, the view could show one of several things on the same route.
                  Visiting localhost:3000/home will show the HomePage if the user is logged in.
                  If the user is not logged in, the ProtectedRoute will show the 'Login' or 'Register' page.
                  Even though it seems like they are different pages, the user is always on localhost:3000/home */}
                <ProtectedRoute exact path="/home" component={Home} />
                {/* These are the same except ProtectedRoute returns the component passed through via component prop */}
                <ProtectedRoute exact path="/my-pins" component={MyPins} />
                <ProtectedRoute exact path="/my-meetups" component={MyMeetups} />
                <ProtectedRoute exact path="/profile" component={Profile} />
                <ProtectedRoute exact path="/organize-meetup" component={Organize} />
                <ProtectedRoute exact path="/meetup" component={SingleMeetup} />
                <ProtectedRoute exact path="/admin" component={AdminView} />
                {/* If none of the other routes matched, we will show a 404. */}
                <Route component={ErrorPage} />
              </Switch>
            </Grid>
          </Grid>
        </div>
        <Route path="/" render={(routerProps) => (routerProps.location.pathname !== "/welcome") && <Footer />} />
      </Router>
    )
  }
}

export default connect()(App);
