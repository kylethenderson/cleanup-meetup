import React, { Component } from 'react'
import { connect } from 'react-redux'

class Meetups extends Component {

    componentDidMount() {
        this.props.dispatch({type: 'FETCH_USER_MEETUPS'})
    }

    viewMeetup = (meetup) => {
        return this.props.history.push({
            pathname: '/meetup',
            state: meetup,
            })
    }

    render() {
        return (
            <>
                <h1>My MeetUps</h1>
                {this.props.userMeetups.map( meetup => <div key={meetup.meetup_id}>
                    <span>{meetup.meetup_id}</span>
                    <span>{meetup.description}</span>
                    { meetup.ref_organized_by === this.props.user.id ? 
                        <button onClick={()=>this.viewMeetup(meetup)}>View</button>
                        :
                        <button>Leave</button>
                    }
                    </div>)}
            </>
        )
    }
}

const mapStateToProps = (reduxState) => ({
    userMeetups: reduxState.meetups.userMeetups,
    user: reduxState.user,
})

export default connect(mapStateToProps)(Meetups);