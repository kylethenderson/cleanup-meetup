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
        selectedPark: null,
        defaultLat: null,
        defaultLong: null,
    }

    componentDidMount() {
        axios.get('/api/data')
            .then(response => {
                this.props.dispatch({ type: 'SET_PIN_LIST', payload: response.data })
            })
    }

    setSelectedPark = (value) => {
        this.setState({
            ...this.state,
            selectedPark: value,
        })
    }

    handleClick = (event) => {
        console.log(this.state.selectedPark)
    }
    organizeMeetup = () => {
        axios.post('/api/add-meetup', {
            pinId: this.state.selectedPark.pinId,
            userId: this.state.selectedPark.created_by
        })
            .then(response => {
                this.setState({
                    selectedPark: null,
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
                    {this.props.pinList && this.props.pinList.map(park => (
                        <Marker
                            key={park.pin_id}
                            position={{
                                lat: Number(park.latitude),
                                lng: Number(park.longitude),
                            }}
                            onClick={() => { this.setSelectedPark(park) }}
                        />
                    ))}

                    {this.state.selectedPark &&
                        <InfoWindow
                            position={{
                                lat: Number(this.state.selectedPark.latitude),
                                lng: Number(this.state.selectedPark.longitude),
                            }}
                            onCloseClick={() => { this.setSelectedPark(null) }}
                        >

                            {this.state.selectedPark.ref_organized_by ?
                                <div>
                                    <h5>Date: {this.state.selectedPark.date}</h5>
                                    <h5>Time: {this.state.selectedPark.time}</h5>
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