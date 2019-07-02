import React, { Component } from 'react'
import { connect } from 'react-redux'

class Meetups extends Component {
    render() {
        return (
            <>
                <h1>My MeetUps</h1>
            </>
        )
    }
}

const mapStateToProps = (reduxState) => ({
    reduxState
})

export default connect(mapStateToProps)(Meetups);