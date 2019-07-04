import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import MeetupItem from './MeetupItem'
import Grid from '@material-ui/core/Grid'
import './Meetups.css'

class Meetups extends Component {

    componentDidMount() {
        this.props.dispatch({ type: 'FETCH_USER_MEETUPS' })
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
                {this.props.user.latitude ?
                    <div id="myMeetups">
                        <h2>My MeetUps</h2>
                        <Grid container direction="row" justify="center" alignItems="center">
                            {this.props.userMeetups.map(meetup => <MeetupItem history={this.props.history} key={meetup.meetup_id} meetup={meetup} />)}
                        </Grid>
                    </div>
                    :
                    <Redirect to="/home" />
                }
            </>
        )
    }
}

const mapStateToProps = (reduxState) => ({
    userMeetups: reduxState.meetups.userMeetups,
    user: reduxState.user,
})

export default connect(mapStateToProps)(Meetups);