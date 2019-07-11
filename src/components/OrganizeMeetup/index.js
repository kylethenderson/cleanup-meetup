import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

class MeetupForm extends Component {

    state = {
        date: '',
        time: '10:00',
        supplies: '',
    }

    // on mount, get the current date to use in the form
    componentDidMount() {
        this.getCurrentDate();
    }

    getCurrentDate = () => {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;
        this.setState({
            ...this.state, date: today,
        })
    }

    // handle input changes
    handleChange = (event) => {
        this.setState({
            ...this.state, [event.target.id]: event.target.value,
        })
    }

    // submit the new meetup by dispatching the action with the requisite data
    // reset local state, and navigate user back home
    submitMeetup = (event) => {
        event.preventDefault();
        this.props.dispatch({
            type: 'ADD_MEETUP',
            payload: {
                ...this.state, pinId: this.props.selectedPin.pin_id,
            }
        })
        this.setState({
            date: '',
            time: '',
            supplies: '',
        })
        this.props.history.push('/home');
    }

    render() {
        return (
            <>
                {this.props.selectedPin ?
                    <Grid container justify="center">
                        <Grid item xs={10} className="grid-item-text-center">
                            {/* {JSON.stringify(this.props.selectedPin)} */}
                            <h2>Organize Meetup</h2>
                            <form onSubmit={this.submitMeetup} noValidate autoComplete="off">
                                <TextField
                                    value={this.state.date}
                                    id="date"
                                    type="date"
                                    margin="normal"
                                    label="MeetUp Date"
                                    fullWidth
                                    onChange={this.handleChange}
                                />
                                <TextField
                                    value={this.state.time}
                                    id="time"
                                    type="time"
                                    label="MeetUp Time"
                                    margin="normal"
                                    fullWidth
                                    onChange={this.handleChange}
                                />
                                <TextField
                                    value={this.state.supplies}
                                    id="supplies"
                                    label="Recommended Supplies"
                                    margin="normal"
                                    multiline
                                    rows="6"
                                    fullWidth
                                    variant="outlined"
                                    onChange={this.handleChange}
                                />
                                <Button className="medium-button-text" type="submit" variant="contained" color="primary">Organize</Button>
                            </form>
                        </Grid>

                    </Grid>
                    :
                    <Redirect to="/home" />
                }
            </>
        )
    }
}

const mapStateToProps = reduxState => ({
    selectedPin: reduxState.pins.selectedPin,
})

export default connect(mapStateToProps)(MeetupForm);