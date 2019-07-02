import React, { Component } from 'react'

class SingleMeetup extends Component {
    render() {
        return (
            <>
                <h1>
                    Single Meetup
                </h1>
                {JSON.stringify(this.props.location.state)}
            </>
        )
    }
}

export default SingleMeetup