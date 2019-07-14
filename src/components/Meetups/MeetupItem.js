import React, { Component } from 'react'
import { connect } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

class MeetupItem extends Component {

    // if user wants to view meetup, navigate to singleMeetup with the meetup id in the url
    viewMeetup = () => {
        this.props.history.push(`/meetup?${this.props.meetup.meetup_id}`);
    }

    // if they want to leave a meetup they've joined, dispatch that action with the meetup id as payload
    leaveMeetup = (id) => {
        this.props.dispatch({
            type: 'LEAVE_MEETUP',
            payload: {
                meetupId: id,
            }
        });
        this.props.history.push('/home');
    }

    render() {
        return (
            <Grid item container xs={12} justify="space-between" alignItems="center" className="meetup-card">
                <Grid item xs={6}>
                    <p>{this.props.meetup.description}</p>
                </Grid>
                {this.props.meetup.ref_organized_by === this.props.user.id ?
                    <Grid item xs={6}>
                        <Button onClick={this.viewMeetup} size="small" variant="contained" color="primary">View</Button>
                    </Grid>
                    :
                    <Grid item xs={6}>
                        <Button onClick={this.viewMeetup} mx={2} size="small" variant="contained" color="primary">View</Button>
                        <Button onClick={() => this.leaveMeetup(this.props.meetup.meetup_id)} size="small" variant="contained" color="primary">Leave</Button>
                    </Grid>
                }
            </Grid>
        )
    }
}

const mapStateToProps = reduxState => ({
    user: reduxState.user,
})

export default connect(mapStateToProps)(MeetupItem);