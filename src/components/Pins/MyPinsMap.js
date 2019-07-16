import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import {
    GoogleMap,
    withScriptjs,
    withGoogleMap,
    Marker,
    InfoWindow,
} from 'react-google-maps'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Dialog from '@material-ui/core/Dialog'

class Map extends Component {
    state = {
        selectedPin: null,
        dialogOpen: false,
    }

    // first thing, clear any selected pin that might still be in redux state
    componentDidMount() {
        this.props.dispatch({ type: 'CLEAR_SELECTED_PIN' })
    }

    // when user clicks on a pin, set that in redux state
    setSelectedPin = (pin) => {
        this.props.dispatch({ type: 'SET_SELECTED_PIN', payload: pin });
    }

    // function to toggle the delete confirmation dialog box
    toggleDeleteDialog = () => {
        this.setState({
            ...this.state, dialogOpen: !this.state.dialogOpen,
        })
    }

    // if user clicks to view meetup, navigate to that page with the meetup id in the url
    // then clear the selected pin in redux
    viewMeetup = () => {
        this.props.dispatch({type: 'CLEAR_SINGLE_MEETUP'})
        this.props.dispatch({ type: 'CLEAR_SELECTED_PIN' });
        this.props.history.push(`/meetup?${this.props.selectedPin.meetup_id}`);
    }

    // if they want to organize, navigate to the organize page
    organizeMeetup = () => {
        this.props.history.push('/organize-meetup');
    }

    // function to delete pin - dispatch the action with the pin id as the payload
    deletePin = () => {
        this.props.dispatch({ type: 'DELETE_PIN', payload: this.props.selectedPin.pin_id })
        this.setState({
            dialogOpen: false,
        })
        this.props.history.push('/home');
    }

    // allow users to move their own pins on the map from this page
    updateMarkerLocation = (event, pin) => {
        this.props.dispatch({
            type: 'UPDATE_PIN_LOCATION',
            payload: {
                latitude: event.latLng.lat(),
                longitude: event.latLng.lng(),
                id: pin.pin_id,
            }
        })
    }

    render() {
        return (
            <>
                {this.props.pinList.length ?
                    <>
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
                            {this.props.pinList.length && this.props.pinList.map(pin => {
                                if (pin.ref_pin_owner === this.props.user.id) {
                                    return (
                                        <Marker
                                            defaultDraggable={!pin.meetup_id && true}
                                            onDragEnd={(event) => this.updateMarkerLocation(event, pin)}
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
                                    )
                                } return <Marker key={pin.pin_id} />
                            })}

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
                                            <Button variant="contained" color="primary" size="small" onClick={this.viewMeetup}>View</Button>
                                            <Button variant="contained" className="error-background" size="small" onClick={this.toggleDeleteDialog}>Delete</Button>
                                        </div>
                                        :
                                        <div id="infoWindow">
                                            <h4>Actions for this pin</h4>
                                            <Button variant="contained" color="primary" size="small" onClick={this.organizeMeetup}>Organize</Button>
                                            <Button variant="contained" className="error-background" size="small" onClick={this.toggleDeleteDialog}>Delete</Button>
                                        </div>
                                    }
                                </InfoWindow>
                            }
                        </GoogleMap>

                        <Dialog open={this.state.dialogOpen}>
                            <Grid container justify="center" id="deleteDialog">
                                <Grid item xs={9} className="grid-item-text-center">
                                    <h2>This will delete this pin and any MeetUp organized on it.</h2>
                                    <h3>Are you sure?</h3>
                                </Grid>
                                <Grid item xs={5} className="grid-item-text-center">
                                    <Button variant="contained" color="secondary" onClick={this.toggleDeleteDialog}>No</Button>
                                </Grid>
                                <Grid item xs={5} className="grid-item-text-center">
                                    <Button variant="contained" color="primary" onClick={this.deletePin}>Yes</Button>
                                </Grid>
                            </Grid>
                        </Dialog>
                    </>
                    :
                    <Redirect to="/home" />
                }
            </>
        )
    }
}

const mapReduxStateToProps = (reduxState) => ({
    pinList: reduxState.pins.pinList,
    user: reduxState.user,
    selectedPin: reduxState.pins.selectedPin,
})

const WrappedMap = withScriptjs(withGoogleMap(Map));

export default connect(mapReduxStateToProps)(WrappedMap);