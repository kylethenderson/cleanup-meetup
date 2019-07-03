import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import WrappedMap from './MyPinsMap'

// import the key from .env - keeps key secure
const MAPS_KEY = `${process.env.REACT_APP_MAPS_KEY}`;

class MyPins extends Component {
    state = {
        userLat: null,
        userLong: null,
    }

    componentDidMount() {
        this.getUserLocation();
    }

    getUserLocation = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                const userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }
                this.setState({
                    ...this.state,
                    userLat: userLocation.latitude,
                    userLong: userLocation.longitude,
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
                                defaultLat={this.state.userLat}
                                defaultLong={this.state.userLong}
                            />
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
    pinList: reduxState.pins.pinList,
})

export default connect(mapStateToProps)(MyPins)