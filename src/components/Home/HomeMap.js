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

    setSelectedPin = (value) => {
        this.setState({
            ...this.state,
            selectedPin: value,
        })
    }

    handleClick = (event) => {
        console.log(this.state.selectedPin)
    }
    organizeMeetup = () => {
        axios.post('/api/add-meetup', {
            pinId: this.state.selectedPin.pinId,
            userId: this.state.selectedPin.created_by
        })
            .then(response => {
                this.setState({
                    selectedPin: null,
                })
                axios.get('/api/data')
                    .then(response => {
                        console.log(response);
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

                    {this.state.selectedPin &&
                        <InfoWindow
                            position={{
                                lat: Number(this.state.selectedPin.latitude),
                                lng: Number(this.state.selectedPin.longitude),
                            }}
                            onCloseClick={() => { this.setSelectedPin(null) }}
                        >

                            {this.state.selectedPin.ref_organized_by ?
                                <div>
                                    <h5>Date: {this.state.selectedPin.date}</h5>
                                    <h5>Time: {this.state.selectedPin.time}</h5>
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
    reduxState
})

const WrappedMap = withScriptjs(withGoogleMap(Map));

export default connect(mapReduxStateToProps)(WrappedMap);