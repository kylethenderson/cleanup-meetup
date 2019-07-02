import React, { Component } from 'react'
import { connect } from 'react-redux'

class Pins extends Component {
    render() {
        return (
            <>
                <h1>My Pins</h1>
            </>
        )
    }
}

const mapStateToProps = (reduxState) => ({
    reduxState
})

export default connect(mapStateToProps)(Pins);