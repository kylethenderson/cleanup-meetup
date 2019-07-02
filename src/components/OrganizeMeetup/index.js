import React, { Component } from 'react'
import { connect } from 'react-redux'

class Organize extends Component {

    organizeMeetup = () => {
        console.log(this.props.selectedPin);
        this.props.dispatch({
            type: 'ADD_MEETUP',
            payload: {
                pinId: this.props.selectedPin.pin_id,
                userId: this.props.selectedPin.ref_created_by
            }
        })
    }
    
    render () {
        return (
            <>
                <h1>Organize Meetup</h1>
            </>
        )
    }
}

const mapStateToProps = (reduxState) => ({
    reduxState,
})

export default connect(mapStateToProps)(Organize);