import React, { Component } from 'react'
import WrappedMap from './HomeMap'
import { connect } from 'react-redux'
import { ClipLoader } from 'react-spinners';
import Button from '@material-ui/core/Button'

import './HomePage.css'

// import the key from .env - keeps key secure
const MAPS_KEY = `${process.env.REACT_APP_MAPS_KEY}`;

class TestMap extends Component {
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

    addPin = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                const userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }
                this.props.dispatch({
                    type: 'ADD_PIN',
                    payload: userLocation,
                })
            }
        );
    }
    render() {
        return (
            <>
            {/* {JSON.stringify(this.props.reduxState.pins.pinList)} */}
                <div className="mapContainer">
                    {this.state.userLat ?
                            <WrappedMap
                            defaultLat={this.state.userLat}
                            defaultLong={this.state.userLong}
                            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&v=3.exp&libraries=geometry,drawing,places`}
                            loadingElement={<div style={{ height: "100%" }} />}
                            containerElement={<div style={{ height: "100%" }} />}
                            mapElement={<div style={{ height: "100%" }} />}
                            className="mapWrapper"
                            history={this.props.history}
                        />
                        :
                        <div id="mapLoader">
                            <h4>Map Loading...</h4>
                            <ClipLoader
                                sizeUnit={"px"}
                                size={75}
                                width={5}
                                color={'rgba(0, 143, 12, 1);'}
                            />
                        </div>
                    }
                </div>
                <div id="buttonContainer">
                    <Button size="large" variant="contained" color="primary" onClick={this.addPin}>Add Pin</Button>
                </div>
            </>
        )
    }
}

const mapStateToProps = (reduxState) => ({
    reduxState
})

export default connect(mapStateToProps)(TestMap);
