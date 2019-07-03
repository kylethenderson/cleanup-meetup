import React, { Component } from 'react'
import { connect } from 'react-redux'
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
                        <div id="singleMeetDeets">
                            <p>Date: {meetup.date.substring(5, 7) + "/" + meetup.date.substring(8, 10) + "/" + meetup.date.substring(0, 4)}</p>
                            <p>Time: {meetup.time.substring(0, 5)}</p>
                            <p>Description: {meetup.description}</p>
                            <p>Recommended Supplies: {meetup.supplies}</p>
                            <p>Users Joined: {this.state.usersJoined}</p>
                            {meetup.ref_created_by === this.props.user.id ?
                                <><p>created by current user</p></>
                                :
                                <><p>not created by current user</p></>
                            }
                            <pre>{JSON.stringify(meetup, null, 2)}</pre>
                        </div>
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