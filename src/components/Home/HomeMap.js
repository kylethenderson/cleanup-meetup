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
        lat: null,
        long: null,
    }

    // on mount, get all the pins from the db
    componentDidMount() {
        this.props.dispatch({ type: 'FETCH_PINS' });
    }

    // when one pin is clicked, set the data for that pin in redux
    setSelectedPin = (pin) => {
        this.props.dispatch({ type: 'SELECT_PIN', payload: pin });
    }

    // if user clicks to view meetup, push to the singleMeetup page with the id in the url and clear selected pin in redux
    viewMeetup = () => {
        this.props.dispatch({type: 'CLEAR_SINGLE_MEETUP'})
        this.props.dispatch({ type: 'CLEAR_SELECTED_PIN' });
        this.props.history.push(`/meetup?${this.props.selectedPin.meetup_id}`);
    }

    // if user clicks to organize, navigate to the organize meetup page and leave the selectedPin in redux
    organizeMeetup = () => {
        this.props.history.push('/organize-meetup');
    }

    render() {
        return (
            <>
            {this.props.pinList && 
                <GoogleMap
                    defaultOptions={{
                        streetViewControl: false,
                        fullscreenControl: false,
                        controlSize: 20,
                        minZoom: 3.25,
                    }}
                    defaultZoom={10.75}
                    defaultCenter={{ lat: this.props.defaultLat, lng: this.props.defaultLong }}
                >
                    {/* map through the list of pins in redux and put a marker on the map for each one */}
                    {this.props.pinList && this.props.pinList.map(pin => (
                        <Marker
                            key={pin.pin_id}
                            icon={pin.meetup_id ?
                                { url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' }
                                :
                                { url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }
                            }
                            position={{
                                lat: Number(pin.latitude),
                                lng: Number(pin.longitude),
                            }}
                            onClick={() => { this.setSelectedPin(pin) }}
                        />
                    ))}

                    {/* when user clicks on a pin, selectedPin is set, and infoWindow will display */}
                    {this.props.selectedPin &&
                        <InfoWindow
                            position={{
                                lat: Number(this.props.selectedPin.latitude),
                                lng: Number(this.props.selectedPin.longitude),
                            }}
                            onCloseClick={() => { this.props.dispatch({ type: 'CLEAR_SELECTED_PIN' }) }}

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
                                    <h4>Dropped by: {this.props.selectedPin.username}</h4>
                                    <h4>Organize Meetup</h4>
                                    <Button variant="contained" color="secondary" size="small" onClick={this.organizeMeetup}>Let's Go!</Button>
                                </div>
                            }
                        </InfoWindow>
                    }
                </GoogleMap>
            }
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