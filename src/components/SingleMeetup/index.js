import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import WrappedMap from './SingleMeetupMap'

import './SingleMeetup.css'

// import the key from .env - keeps key secure
const MAPS_KEY = `${process.env.REACT_APP_MAPS_KEY}`;

class SingleMeetup extends Component {
    state = {
        usersJoined: 0,
        formattedDate: '',
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

    formatDate = (date) => {

    }

    render() {
        const meetup = this.props.location.state;
        return (
            <div id="singleMeetup">
                {meetup ?
                    <>
                        <div className="mapContainer">
                            <WrappedMap
                                defaultLat={Number(meetup.latitude)}
                                defaultLong={Number(meetup.longitude)}
                                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&v=3.exp&libraries=geometry,drawing,places`}
                                loadingElement={<div style={{ height: "100%" }} />}
                                containerElement={<div style={{ height: "100%" }} />}
                                mapElement={<div style={{ height: "100%" }} />}
                                className="mapWrapper"
                                meetup={meetup}
                            />
                        </div>
                        <div id="singleMeetDeets">
                            <p>Date: {meetup.date}</p>
                            <p>Time: {meetup.time}</p>
                            <p>Description: {meetup.description}</p>
                            <p>Recommended Supplies: {meetup.supplies}</p>
                            <p>Users Joined: {this.state.usersJoined}</p>
                        </div>
                        <pre>{JSON.stringify(meetup, null, 2)}</pre>
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

export default SingleMeetup