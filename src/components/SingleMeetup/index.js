import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import WrappedMap from './SingleMeetupMap'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'

import './SingleMeetup.css'

// import the key from .env - keeps key secure
const MAPS_KEY = `${process.env.REACT_APP_MAPS_KEY}`;

class SingleMeetup extends Component {
    state = {
        dialogOpen: false,
        usersJoined: [],
        userIsJoined: false,
        editMode: false,
        date: '',
        time: '',
        description: '',
        supplies: '',
    }

    // functions to get singleMeetup data and the array of users that are associate with this meeetup
    componentDidMount() {
        this.getSingleMeetup();
        this.getUsersJoined();
    }

    // dispatches action to get single meetup data - payload is the id at the end of the url search query string
    getSingleMeetup = () => {
        this.props.dispatch({ type: 'FETCH_SINGLE_MEETUP', payload: Number(this.props.location.search.substring(1)) })
    }

    // when user clicks to edit singleMeetup data, set local state to what is in the singleMeetup reducer
    enableEdit = () => {
        this.setState({
            ...this.state,
            date: this.props.singleMeetup.date.substring(0, 4) + "-" + this.props.singleMeetup.date.substring(5, 7) + "-" + this.props.singleMeetup.date.substring(8, 10),
            time: this.props.singleMeetup.time,
            description: this.props.singleMeetup.description,
            supplies: this.props.singleMeetup.supplies,
            editMode: true,
        })
    }

    // function to get the users associated with this meetup - payload for action is id at end of url string
    getUsersJoined = () => {
        if (this.props.location.search) {
            axios.get(`/api/meetups/joins?id=${Number(this.props.location.search.substring(1))}`)
                .then(response => {
                    // we need to find if the current user is a part of this meetup - we find that with the filter method
                    const userIsJoined = response.data.filter(obj => obj.ref_user_id === this.props.user.id)
                    // if filter finds the current user within the array of all users associated with this meetup, we
                    // set local state with a true boolean for the user
                    if (userIsJoined.length) {
                        this.setState({
                            ...this.state,
                            usersJoined: response.data,
                            userIsJoined: true,
                        })
                    }
                    // otherwise, we just set local state to the array of users associated with this meetup 
                    else {
                        this.setState({
                            usersJoined: response.data
                        })
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    // handles change for inputs
    handleChange = (event) => {
        this.setState({
            ...this.state, [event.target.id]: event.target.value,
        })
    }

    // when user clicks to save edited data, dispatch action to update db with requisite payload object
    editMeetup = () => {
        this.setState({
            ...this.state, editMode: false,
        })
        this.props.dispatch({
            type: 'EDIT_MEETUP',
            payload: {
                date: this.state.date,
                time: this.state.time,
                supplies: this.state.supplies,
                description: this.state.description,
                meetupId: this.props.singleMeetup.meetup_id,
                pinId: this.props.singleMeetup.pin_id,
            }
        })
    }

    // if user wants to join the meetup, dispatch action to add them to the meetup_joins table in db with meetup id as the payload
    joinMeetup = () => {
        this.props.dispatch({
            type: 'JOIN_MEETUP',
            payload: {
                meetupId: Number(this.props.location.search.substring(1)),
            }
        })
        this.props.history.push('/home');
    }

    // if user wants to leave the meetup, dispatch action to remove them to the meetup_joins table in db with meetup id as the payload
    leaveMeetup = (id) => {
        this.props.dispatch({
            type: 'LEAVE_MEETUP',
            payload: {
                meetupId: Number(this.props.location.search.substring(1)),
            }
        });
        this.props.history.push('/home');
    }

    // function to toggle the delete confirmation dialog box 
    toggleDeleteDialog = () => {
        this.setState({
            ...this.state, dialogOpen: !this.state.dialogOpen,
        })
    }

    // dispatches action to delete the meetup - payload is the meetup id from the url string
    // close the delete dialog box and then navigate home
    deleteMeetup = () => {
        this.props.dispatch({ type: 'DELETE_MEETUP', payload: Number(this.props.location.search.substring(1)) });
        this.toggleDeleteDialog();
        this.props.history.push('/home');
    }

    render() {
        const meetup = this.props.singleMeetup;
        return (
            <div id="singleMeetup">
                {meetup.meetup_id ?
                    <>  
                        <div className="mapContainer">
                            <WrappedMap
                                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${MAPS_KEY}`}
                                loadingElement={<div style={{ height: "100%" }} />}
                                containerElement={<div style={{ height: "100%" }} />}
                                mapElement={<div style={{ height: "100%" }} />}
                                className="mapWrapper"
                                meetup={this.props.singleMeetup}
                                defaultLat={Number(meetup.latitude)}
                                defaultLong={Number(meetup.longitude)}
                            />
                        </div>
                        <Grid container justify="center" id="singleMeetDeets">
                            <Grid item xs={10}>
                                <h3>Organized by: {meetup.organizer}</h3>
                            </Grid>
                            {/* Here, we display the data or an input based on the editMode boolean value in local state */}
                            <Grid item xs={5}>
                                {this.state.editMode ?
                                    <TextField
                                        value={this.state.date}
                                        id="date"
                                        type="date"
                                        margin="normal"
                                        label="MeetUp Date"
                                        fullWidth
                                        onChange={this.handleChange}
                                    />
                                    :
                                    <p>Date: {meetup.date.substring(5, 7) + "/" + meetup.date.substring(8, 10) + "/" + meetup.date.substring(0, 4)}</p>
                                }
                            </Grid>
                            <Grid item xs={5}>
                                {this.state.editMode ?
                                    <TextField
                                        value={this.state.time}
                                        id="time"
                                        type="time"
                                        label="MeetUp Time"
                                        margin="normal"
                                        fullWidth
                                        onChange={this.handleChange}
                                    />
                                    :
                                    <p>Time: {meetup.time.substring(0, 5)}</p>
                                }
                            </Grid>
                            <Grid item xs={10}>
                                {this.state.editMode ?
                                    <TextField
                                        value={this.state.description}
                                        id="description"
                                        label="Description"
                                        margin="normal"
                                        multiline
                                        rows="4"
                                        fullWidth
                                        variant="outlined"
                                        onChange={this.handleChange}
                                    />
                                    :
                                    <p>Description: {meetup.description}</p>
                                }
                            </Grid>
                            <Grid item xs={10}>
                                {this.state.editMode ?
                                    <TextField
                                        value={this.state.supplies}
                                        id="supplies"
                                        label="Recommended Supplies"
                                        margin="normal"
                                        multiline
                                        rows="4"
                                        fullWidth
                                        variant="outlined"
                                        onChange={this.handleChange}
                                    />
                                    :
                                    <p>Recommended Supplies: {meetup.supplies}</p>
                                }
                            </Grid>
                            <Grid item xs={10}>
                                <p>Users Joined: {this.state.usersJoined.length}</p>
                            </Grid>
                            <Grid id="buttonContainer" item xs={10} container justify="center" className="grid-item-text-center">
                                <Grid item xs={6}>
                                    {this.props.user.admin || meetup.ref_organized_by === this.props.user.id ?
                                        <Button variant="contained" className="error-background" onClick={this.toggleDeleteDialog}>Delete Meetup</Button>
                                        :
                                        <></>
                                    }
                                </Grid>
                                <Grid item xs={6}>
                                    {meetup.ref_organized_by === this.props.user.id ?
                                        <>
                                            {this.state.editMode ?
                                                <Button variant="contained" color="primary" onClick={this.editMeetup}>Update</Button>
                                                :
                                                <Button variant="contained" color="primary" onClick={this.enableEdit}>Edit Meetup</Button>
                                            }
                                        </>
                                        :
                                        <>
                                            {this.state.userIsJoined ?
                                                <Button variant="contained" color="primary" onClick={this.leaveMeetup}>Leave</Button>
                                                :
                                                <Button variant="contained" color="primary" onClick={this.joinMeetup}>Join</Button>
                                            }
                                        </>
                                    }
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Delete confirmation dialog box */}
                        <Dialog open={this.state.dialogOpen}>
                            <Grid container justify="center" id="deleteDialog">
                                <Grid item xs={9} className="grid-item-text-center">
                                    <h2>This will delete the meetup for this pin.</h2>
                                    <h3>Are you sure?</h3>
                                </Grid>
                                <Grid item xs={5} className="grid-item-text-center">
                                    <Button variant="contained" color="secondary" onClick={this.toggleDeleteDialog}>No</Button>
                                </Grid>
                                <Grid item xs={5} className="grid-item-text-center">
                                    <Button variant="contained" color="primary" onClick={this.deleteMeetup}>Yes</Button>
                                </Grid>
                            </Grid>
                        </Dialog>
                    </>
                    :
                    <>
                    </>
                }
            </div>
        )
    }
}

const mapStateToProps = reduxState => ({
    user: reduxState.user,
    singleMeetup: reduxState.meetups.singleMeetup,
})

export default connect(mapStateToProps)(SingleMeetup)