import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    GoogleMap,
    withScriptjs,
    withGoogleMap,
    Marker,
} from 'react-google-maps'

class Map extends Component {

    render() {
        return (
            <>
                <GoogleMap
                    defaultOptions={{
                        streetViewControl: false,
                        fullscreenControl: false,
                        controlSize: 20,
                        minZoom: 8,
                        draggable: true,
                    }}
                    defaultZoom={15}
                    defaultCenter={{ lat: this.props.defaultLat, lng: this.props.defaultLong }}
                >
                        <Marker
                            position={{
                                lat: Number(this.props.defaultLat),
                                lng: Number(this.props.defaultLong),
                            }}
                        />
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