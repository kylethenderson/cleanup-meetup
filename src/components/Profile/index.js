import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'

import './Profile.css'

class Profile extends Component {

    state = {
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        editMode: false,
    }

    componentDidMount() {
        this.setUserData();
    }

    setUserData = () => {
        this.props.user &&
            this.setState({
                username: this.props.user.username,
                firstName: this.props.user.first_name,
                lastName: this.props.user.last_name,
                email: this.props.user.email,
                phone: this.props.user.phone,
            })
    }

    updateUserData = () => {
        // update the db with new data later
        this.props.dispatch({
            type: 'UPDATE_USER_DATA',
            payload: this.state
        })
        this.setState({
            ...this.state, editMode: false,
        })
    }

    handleChange = (event) => {
        this.setState({
            ...this.state, [event.target.id]: event.target.value,
        })
    }

    render() {
        return (
            <>
                {this.props.user ?
                    <Grid container justify="center" id="profilePage">
                        <Grid item xs={9}>
                            <h2>Profile</h2>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField
                                onChange={this.handleChange}
                                id="username"
                                disabled={!this.state.editMode}
                                fullWidth
                                label="Username"
                                value={this.state.username}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={9}>
                            <TextField
                                onChange={this.handleChange}
                                id="firstName"
                                disabled={!this.state.editMode}
                                fullWidth
                                label="First Name"
                                value={this.state.firstName}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={9}>
                            <TextField
                                onChange={this.handleChange}
                                id="lastName"
                                disabled={!this.state.editMode}
                                fullWidth
                                label="Last Name"
                                value={this.state.lastName}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={9}>
                            <TextField
                                onChange={this.handleChange}
                                id="email"
                                disabled={!this.state.editMode}
                                fullWidth
                                label="Email Address"
                                value={this.state.email}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={9}>
                            <TextField
                                onChange={this.handleChange}
                                id="phone"
                                disabled={!this.state.editMode}
                                fullWidth
                                label="Phone Number"
                                value={this.state.phone}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={9} className="grid-item-text-center">
                            {this.state.editMode ?
                                <Button size="large" onClick={this.updateUserData} variant="contained" color="primary">Update</Button>
                                :
                                <Button size="large" onClick={() => { this.setState({ ...this.state, editMode: true }) }} variant="contained" color="primary">Edit</Button>
                            }
                        </Grid>
                    </Grid>
                    :
                    <Redirect to="/home" />
            }
            </>
        )
    }
}

const mapStateToProps = (reduxState) => ({
    user: reduxState.user
})

export default connect(mapStateToProps)(Profile);