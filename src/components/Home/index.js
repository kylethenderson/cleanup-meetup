import React, { Component } from 'react'
import WrappedMap from './HomeMap'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { BounceLoader } from 'react-spinners';
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Icon from '@material-ui/core/Icon'

import './HomePage.css'

// import the key from .env - keeps key secure
const MAPS_KEY = `${process.env.REACT_APP_MAPS_KEY}`;

class TestMap extends Component {
    state = {
        dialogOpen: false,
        description: '',
        image: '',
        locationErrorMsg: '',
        locationError: false,
    }
    // on mount, try to get user location and clear any selected pin data in redux
    componentDidMount() {
        this.checkForLocation();
        this.props.dispatch({ type: 'CLEAR_SELECTED_PIN' })
    }

    // try to get user location, if unable, set error msg
    checkForLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.getUserLocation, this.positionError);
        } else {
            this.setState({
                ...this.state,
                locationErrorMsg: "Geolocation is not supported by this browser.",
                locationError: true,
            })
        }
    }

    // if get location was successful, set user location in redux
    getUserLocation = (position) => {
        this.props.dispatch({
            type: 'SET_USER_LOCATION',
            payload: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            }
        })
    }

    // if get user location unsuccessful, set error message based on error code
    positionError = (error) => {
        switch (error.code) {
            case 1:
                this.setState({
                    ...this.state,
                    locationErrorMsg: "User denied the request for Geolocation.",
                    locationError: true,
                })
                break;
            case 2:
                this.setState({
                    ...this.state,
                    locationErrorMsg: "Location information is unavailable.",
                    locationError: true,
                })
                break;
            case 3:
                this.setState({
                    ...this.state,
                    locationErrorMsg: "The request to get user location timed out.",
                    locationError: true,
                })
                break;
            default:
                this.setState({
                    ...this.state,
                    locationErrorMsg: "An unknown error occurred getting user location.",
                    locationError: true,
                })
                break;
        }
    }

    // handle change for the inputs
    handleChange = (event) => {
        this.setState({
            ...this.state, [event.target.id]: event.target.value
        })
    }

    // function for handling image capture component when that is added
    // captureImage = (event) => {
    //     this.setState({
    //         ...this.state, image: event.target.files,
    //     })
    // }

    // function that opens description dialog when user tries to drop pin.
    openDescriptionDialog = () => {
        this.setState({
            dialogOpen: true,
        });
        // get most current position and set that in redux
        navigator.geolocation.getCurrentPosition(
            position => {
                this.props.dispatch({
                    type: 'SET_USER_LOCATION',
                    payload: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }
                })
            }
        );
    }

    // function to close description dialog box 
    closeDialog = () => {
        this.setState({
            dialogOpen: false,
            description: '',
        });
    }

    // function to add pin - dispatches action to saga with user location and description
    addPin = () => {
        this.props.dispatch({
            type: 'ADD_PIN', payload: {
                latitude: this.props.user.latitude,
                longitude: this.props.user.longitude,
                description: this.state.description,
            }
        })
        this.closeDialog();
    }
    render() {
        return (
            <>
                {this.props.user ?
                    <>
                        <div className="mapContainer">
                            {this.props.user.latitude ?
                                <WrappedMap
                                    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&v=3.exp&libraries=geometry,drawing,places`}
                                    loadingElement={<div style={{ height: "100%" }} />}
                                    containerElement={<div style={{ height: "100%" }} />}
                                    mapElement={<div style={{ height: "100%" }} />}
                                    defaultLat={this.props.user.latitude}
                                    defaultLong={this.props.user.longitude}
                                    className="mapWrapper"
                                    history={this.props.history}
                                />
                                :
                                <>
                                    {/* Only display the loader image as long as there's not an error with location */}
                                    {!this.state.locationErrorMsg &&
                                        <div id="mapLoader">
                                            <h4>Map Loading...</h4>
                                            <BounceLoader
                                                sizeUnit={"px"}
                                                size={75}
                                                color={'rgba(0, 143, 12, 1);'}
                                            />
                                        </div>
                                    }
                                </>
                            }
                        </div>
                        <div id="buttonContainer">
                            <Button disabled={!this.props.user.latitude} className="large-button-text" size="large" variant="contained" color="primary" onClick={this.openDescriptionDialog}>Drop Pin</Button>
                        </div>
                        <Grid container justify="center" id="markerLegend">
                            <Grid item xs={5} className="grid-item-text-center">
                                <img alt="green marker - has meetup" src="https://maps.google.com/mapfiles/ms/icons/green-dot.png" />
                                <h4>meetup <br />organized</h4>
                            </Grid>
                            <Grid item xs={5} className="grid-item-text-center">
                                <img alt="red marker - doesn't have meetup" src="https://maps.google.com/mapfiles/ms/icons/red-dot.png" />
                                <h4>meetup <br />not organized</h4>
                            </Grid>
                        </Grid>

                        {/* Below is the dialog for description when user tries to drop a pin */}
                        <Dialog open={this.state.dialogOpen} onClose={this.handleClose} id="descriptionDialog" className="homePageDialog" aria-labelledby="simple-dialog-title">
                            <Grid container justify="center">
                                <Icon className="closeDialogIcon" onClick={this.closeDialog}>close</Icon>
                                <Grid item xs={9} className="grid-item-text-center">
                                    <h2>Area Description</h2>
                                </Grid>
                                <Grid item xs={9} className="grid-item-text-center">
                                    <TextField
                                        value={this.state.description}
                                        id="description"
                                        label="Description"
                                        margin="normal"
                                        required
                                        multiline
                                        rows="4"
                                        fullWidth
                                        variant="outlined"
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={9} className="grid-item-text-center">
                                    <Button variant="outlined" color="primary" className="medium-button-text" onClick={this.addPin}>Mark Location</Button>
                                </Grid>
                            </Grid>
                        </Dialog>

                        {/* Below is the dialog for error on getting user location */}
                        <Dialog open={this.state.locationError} onClose={() => this.setState({ ...this.state, locationError: false })}  id="errorDialog" className="homePageDialog" aria-labelledby="simple-dialog-title">
                            <Grid container justify="center">
                                <Icon className="closeDialogIcon" onClick={() => this.setState({ ...this.state, locationError: false })}>close</Icon>
                                <Grid item xs={12} className="grid-item-text-center">
                                    <h2>Error retrieving location:<br/>{this.state.locationErrorMsg}</h2>
                                </Grid>
                                <Grid item xs={10} className="grid-item-text-center">
                                    <h3>Please enable location in your browser.</h3>
                                </Grid>
                            </Grid>
                        </Dialog>
                    </>
                    :
                    <>
                        <Redirect to="/" />
                    </>
                }
            </>
        )
    }
}
const mapStateToProps = (reduxState) => ({
    user: reduxState.user,
})

export default connect(mapStateToProps)(TestMap);
