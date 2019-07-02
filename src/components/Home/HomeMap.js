import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import {
    GoogleMap,
    withScriptjs,
    withGoogleMap,
    Marker,
    InfoWindow,
} from 'react-google-maps'

class Map extends Component {
    state = {
        selectedPin: null,
        defaultLat: null,
        defaultLong: null,
    }

    componentDidMount() {
        axios.get('/api/data')
            .then(response => {
                this.props.dispatch({ type: 'SET_PIN_LIST', payload: response.data })
            })
    }

    setSelectedPin = (pin) => {
        this.props.dispatch({ type: 'SET_SELECTED_PIN', payload: pin});
    }

    handleClick = (event) => {
        console.log(this.props.selectedPin)
    }

    organizeMeetup = () => {
        console.log(this.props.selectedPin);
        axios.post('/api/add-meetup', {
            pinId: this.props.selectedPin.pin_id,
            userId: this.props.selectedPin.ref_created_by
        })
            .then(response => {
                this.props.dispatch({type: 'CLEAR_SELECTED_PIN'});
                axios.get('/api/data')
                    .then(response => {
                        this.props.dispatch({ type: 'SET_PIN_LIST', payload: response.data })
                    })
            })
    }

    render() {
        return (
            <>
                <GoogleMap
                    defaultOptions={{
                        streetViewControl: false,
                        fullscreenControl: false,
                        controlSize: 20,
                        minZoom: 9,
                    }}
                    defaultZoom={11.5}
                    defaultCenter={{ lat: this.props.defaultLat, lng: this.props.defaultLong }}
                >
                    {this.props.pinList && this.props.pinList.map(pin => (
                        <Marker
                            key={pin.pin_id}
                            position={{
                                lat: Number(pin.latitude),
                                lng: Number(pin.longitude),
                            }}
                            onClick={() => { this.setSelectedPin(pin) }}
                        />
                    ))}

                    {this.props.selectedPin &&
                        <InfoWindow
                            position={{
                                lat: Number(this.props.selectedPin.latitude),
                                lng: Number(this.props.selectedPin.longitude),
                            }}
                            onCloseClick={() => { this.props.dispatch({type:'CLEAR_SELECTED_PIN'}) }}
                        >

                            {this.props.selectedPin.ref_organized_by ?
                                <div>
                                    <h5>Date: {this.props.selectedPin.date}</h5>
                                    <h5>Time: {this.props.selectedPin.time}</h5>
                                    <button onClick={this.handleClick}>View</button>
                                </div>
                                :
                                <button onClick={this.organizeMeetup}>Without Meetup</button>
                            }
                        </InfoWindow>
                    }
                </GoogleMap>
            </>
        )
    }
}

const mapReduxStateToProps = (reduxState) => ({
    pinList: reduxState.pins.pinList,
    selectedPin: reduxState.pins.selectedPin,
})

const WrappedMap = withScriptjs(withGoogleMap(Map));

export default connect(mapReduxStateToProps)(WrappedMap);