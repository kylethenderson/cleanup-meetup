import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

class Meetups extends Component {

    componentDidMount() {
        axios.get('api/user-meetups')
        .then( response => {
            this.props.dispatch({type: 'SET_USER_MEETUPS', payload: response.data})
        })
        .catch( error => {
            console.log('Error in getting user meetups', error);
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
                        <button>View</button>
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