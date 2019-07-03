import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    GoogleMap,
    withScriptjs,
    withGoogleMap,
    Marker,
    InfoWindow,
} from 'react-google-maps'
import Button from '@material-ui/core/Button'

class Map extends Component {
    state = {
        selectedPin: null,
        defaultLat: null,
        defaultLong: null,
    }

    componentDidMount() {
        this.props.dispatch({type: 'FETCH_PINS'});
    }

    setSelectedPin = (pin) => {
        this.props.dispatch({ type: 'SET_SELECTED_PIN', payload: pin});
    }

    viewMeetup = (meetup) => {
        this.props.history.push({
            pathname: '/meetup',
            state: meetup,
        })
        this.props.dispatch({type: 'CLEAR_SELECTED_PIN'})
    }

    organizeMeetup = () => {
        this.props.history.push('/organize-meetup');
        this.props.dispatch({type: 'CLEAR_SELECTED_PIN'})
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
                            defaultOptions={{
                                pixelOffset: {height: -40}
                            }}
                        >

                            {this.props.selectedPin.ref_organized_by ?
                                <div id="infoWindow">
                                    <h4>Meetup Details: {this.props.selectedPin.meetup_id}</h4>
                                    <h5>Date: {this.props.selectedPin.date.substring(5, 7) + "/" + this.props.selectedPin.date.substring(8, 10) + "/" + this.props.selectedPin.date.substring(0, 4)}</h5>
                                    <h5>Time: {this.props.selectedPin.time}</h5>
                                    <Button variant="contained" color="primary" size="small" onClick={()=>this.viewMeetup(this.props.selectedPin)}>View</Button>
                                </div>
                                :
                                <div id="infoWindow">
                                    <h4>Organize Meetup: {this.props.selectedPin.pin_id}</h4>
                                    <Button variant="contained" color="primary" size="small" onClick={this.organizeMeetup}>Organize</Button>
                                </div>
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