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

    componentDidMount() {
        this.props.dispatch({ type: 'CLEAR_SELECTED_PIN' })
    }

    setSelectedPin = (pin) => {
        this.props.dispatch({ type: 'SET_SELECTED_PIN', payload: pin });
    }

    toggleDeleteDialog = () => {
        this.setState({
            ...this.state, dialogOpen: !this.state.dialogOpen,
        })
    }

    viewMeetup = () => {
        this.props.history.push(`/meetup?${this.props.selectedPin.meetup_id}`);
        this.props.dispatch({ type: 'CLEAR_SELECTED_PIN' });
    }

    organizeMeetup = () => {
        this.props.history.push('/organize-meetup');
    }

    deletePin = () => {
        this.props.dispatch({ type: 'DELETE_PIN', payload: this.props.selectedPin.pin_id })
        this.props.history.push('/home');
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
                            minZoom: 9,
                        }}
                        defaultZoom={11.5}
                        defaultCenter={{ lat: this.props.defaultLat, lng: this.props.defaultLong }}
                    >
                        {this.props.pinList.length && this.props.pinList.map(pin => {
                            if (pin.ref_created_by === this.props.user.id) {
                                return (
                                    <Marker
                                        key={pin.pin_id}
                                        icon={pin.meetup_id ?
                                            { url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' }
                                            :
                                            { url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' }
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
                                defaultOptions={{
                                    pixelOffset: { height: -40 }
                                }}
                            >

                                {this.props.selectedPin.ref_organized_by ?
                                    <div id="infoWindow">
                                        <h4>Meetup Details</h4>
                                        <h5>Date: {this.props.selectedPin.date.substring(5, 7) + "/" + this.props.selectedPin.date.substring(8, 10) + "/" + this.props.selectedPin.date.substring(0, 4)}</h5>
                                        <h5>Time: {this.props.selectedPin.time}</h5>
                                        <Button variant="contained" color="primary" size="small" onClick={this.viewMeetup}>View</Button>
                                        <Button variant="contained" className="error-background" size="small" onClick={this.deletePin}>Delete</Button>
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