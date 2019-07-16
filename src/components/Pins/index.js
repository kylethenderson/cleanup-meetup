import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import WrappedMap from './MyPinsMap'

import './MyPins.css'

// import the key from .env - keeps key secure
const MAPS_KEY = `${process.env.REACT_APP_MAPS_KEY}`;

class MyPins extends Component {
    componentDidMount() {
        this.getUserLocation();
    }

    // get most recent user location and set that in redux 
    getUserLocation = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                this.props.dispatch({
                    type: 'SET_USER_LOCATION',
                    payload: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }
                })
            }
        );
    }

    render() {
        return (
            <div id="myPins">
                {this.props.pinList ?
                    <>
                        <div className="mapContainer">
                            <WrappedMap
                                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${MAPS_KEY}`}
                                loadingElement={<div style={{ height: "100%" }} />}
                                containerElement={<div style={{ height: "100%" }} />}
                                mapElement={<div style={{ height: "100%" }} />}
                                className="mapWrapper"
                                defaultLat={this.props.user.latitude}
                                defaultLong={this.props.user.longitude}
                                history={this.props.history}
                            />
                        </div>
                        <h4 id="helperText">
                            *Click and drag pin to move location
                        </h4>
                    </>
                    :
                    <>
                        <Redirect to="/home" />
                    </>
                }
            </div>
        )
    }
}

const mapStateToProps = reduxState => ({
    user: reduxState.user,
    pinList: reduxState.pins.pinList,
})

export default connect(mapStateToProps)(MyPins)