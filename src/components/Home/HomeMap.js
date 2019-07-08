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

    componentDidMount() {
        this.props.dispatch({type: 'FETCH_PINS'});
    }

    setSelectedPin = (pin) => {
        this.props.dispatch({ type: 'SET_SELECTED_PIN', payload: pin});
    }

    viewMeetup = () => {
        this.props.history.push(`/meetup?${this.props.selectedPin.meetup_id}`);
        this.props.dispatch({type: 'CLEAR_SELECTED_PIN'});
    }

    organizeMeetup = () => {
        this.props.history.push('/organize-meetup');
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
                    defaultZoom={10.75}
                    defaultCenter={{ lat: this.props.defaultLat, lng: this.props.defaultLong }}
                >
                    {this.props.pinList && this.props.pinList.map(pin => (
                        <Marker
                            key={pin.pin_id}
                            icon={pin.meetup_id ? 
                                {url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'}
                                :
                                {url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'}
                            }
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
                                    <h4>Meetup Details</h4>
                                    <h5>Date: {this.props.selectedPin.date.substring(5, 7) + "/" + this.props.selectedPin.date.substring(8, 10) + "/" + this.props.selectedPin.date.substring(0, 4)}</h5>
                                    <h5>Time: {this.props.selectedPin.time}</h5>
                                    <Button variant="contained" color="secondary" size="small" onClick={this.viewMeetup}>View</Button>
                                </div>
                                :
                                <div id="infoWindow">
                                    <h4>Organize Meetup</h4>
                                    <Button variant="contained" color="secondary" size="small" onClick={this.organizeMeetup}>Let's Go!</Button>
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