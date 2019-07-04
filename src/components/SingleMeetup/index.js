import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import WrappedMap from './SingleMeetupMap'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import './SingleMeetup.css'

// import the key from .env - keeps key secure
const MAPS_KEY = `${process.env.REACT_APP_MAPS_KEY}`;

class SingleMeetup extends Component {
    state = {
        usersJoined: 0,
        formattedDate: '',
        editMode: false,
    }
    componentDidMount() {
        this.getUsersJoined();
    }

    getUsersJoined = () => {
        if (this.props.location.state) {
            axios.get(`/api/meetups/joins?id=${this.props.location.state.meetup_id}`)
                .then(response => {
                    this.setState({
                        usersJoined: response.data
                    })
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    editMeetup = () => {
        console.log(this.props.location.state);
    }

    deleteMeetup = () => {
        console.log(this.props.location.state);
        this.props.dispatch({type: 'DELETE_MEETUP', payload: this.props.location.state.meetup_id});
        this.props.history.push('/home');
    }

    render() {
        const meetup = this.props.location.state;
        return (
            <div id="singleMeetup">
                {meetup ?
                    <>
                        <div className="mapContainer">
                            <WrappedMap
                                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${MAPS_KEY}`}
                                loadingElement={<div style={{ height: "100%" }} />}
                                containerElement={<div style={{ height: "100%" }} />}
                                mapElement={<div style={{ height: "100%" }} />}
                                className="mapWrapper"
                                meetup={meetup}
                                defaultLat={Number(meetup.latitude)}
                                defaultLong={Number(meetup.longitude)}
                            />
                        </div>
                        <Grid container justify="center" id="singleMeetDeets">
                            <Grid item xs={5}>
                                <p>Date: {meetup.date.substring(5, 7) + "/" + meetup.date.substring(8, 10) + "/" + meetup.date.substring(0, 4)}</p>
                            </Grid>
                            <Grid item xs={5}>
                                <p>Time: {meetup.time.substring(0, 5)}</p>
                            </Grid>
                            <Grid item xs={10}>
                                <p>Description: {meetup.description}</p>
                            </Grid>
                            <Grid item xs={10}>
                                <p>Recommended Supplies: {meetup.supplies}</p>
                            </Grid>
                            <Grid item xs={10}>
                                <p>Users Joined: {this.state.usersJoined}</p>
                            </Grid>
                            <Grid id="buttonContainer" item xs={10} container justify="center" className="grid-item-text-center">
                                <Grid item xs={6}>
                                    {this.props.user.admin || meetup.ref_created_by === this.props.user.id ? 
                                        <Button variant="contained" className="error-background" onClick={this.deleteMeetup}>Delete</Button>
                                        :
                                        <></>
                                    }
                                </Grid>
                                <Grid item xs={6}>
                                    {meetup.ref_created_by === this.props.user.id ?
                                        <Button variant="contained" color="primary" onClick={this.editMeetup}>Edit</Button>
                                        :
                                        <></>
                                    }
                                </Grid>
                            </Grid>
                            {/* <pre>{JSON.stringify(meetup, null, 2)}</pre> */}
                        </Grid>
                    </>
                    :
                    <>
                        <Redirect to="/" />
                    </>
                }
            </div>
        )
    }
}

const mapStateToProps = reduxState => ({
    user: reduxState.user,
})

export default connect(mapStateToProps)(SingleMeetup)