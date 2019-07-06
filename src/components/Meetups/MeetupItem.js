import React, { Component } from 'react'
import { connect } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

class MeetupItem extends Component {
    
    viewMeetup = (meetup) => {
        return this.props.history.push({
            pathname: '/meetup',
            state: meetup,
        })
    }

    leaveMeetup = (id) => {
        this.props.dispatch({
            type: 'LEAVE_MEETUP', 
            payload: {
                meetupId: id,
            }});
        this.props.history.push('/home');
    }

    render() {
        return (
            <Grid item container xs={12} justify="center" alignItems="center" className="meetup-card">
                <Grid item xs={6}>
                    <p>{this.props.meetup.description}</p>
                </Grid>
                <Grid item xs={3}>

                </Grid>
                <Grid item xs={3} className="grid-item-text-center">
                    {this.props.meetup.ref_organized_by === this.props.user.id ?
                        <Button onClick={() => this.viewMeetup(this.props.meetup)} size="small" variant="contained" color="primary">View</Button>
                        :
                        <Button onClick={() => this.leaveMeetup(this.props.meetup.meetup_id)} size="small" variant="contained" color="primary">Leave</Button>
                    }
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = reduxState => ({
    user: reduxState.user,
})

export default connect(mapStateToProps)(MeetupItem);