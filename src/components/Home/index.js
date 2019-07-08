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
    }
    componentDidMount() {
        this.getUserLocation();
        this.props.dispatch({ type: 'CLEAR_SELECTED_PIN' })
    }

    getUserLocation = () => {
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

    handleChange = (event) => {
        this.setState({
            ...this.state, [event.target.id]: event.target.value
        })
    }

    openDialog = () => {
        this.setState({
            dialogOpen: true,
        });
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

    closeDialog = () => {
        this.setState({
            dialogOpen: false,
            description: '',
        });
    }

    addPin = () => {
        console.log({
            latitude: this.props.user.latitude,
            longitude: this.props.user.longitude,
            description: this.state.description,
        });
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
                                    defaultLat={this.props.user.latitude}
                                    defaultLong={this.props.user.longitude}
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
                                    <BounceLoader
                                        sizeUnit={"px"}
                                        size={75}
                                        color={'rgba(0, 143, 12, 1);'}
                                    />
                                </div>
                            }
                        </div>
                        <div id="buttonContainer">
                            <Button className="large-button-text" size="large" variant="contained" color="primary" onClick={this.openDialog}>Drop Pin</Button>
                        </div>
                        <Dialog open={this.state.dialogOpen} onClose={this.handleClose} id="descriptionDialog" aria-labelledby="simple-dialog-title">
                            <Grid container justify="center">
                                <Icon id="closeDialogIcon" onClick={this.closeDialog}>close</Icon>
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
