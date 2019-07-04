import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import './Organize.css'

class MeetupForm extends Component {

    state = {
        date: '',
        time: '10:00',
        supplies: '',
    }

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

    handleChange = (event) => {
        this.setState({
            ...this.state, [event.target.id]: event.target.value,
        })
    }

    submitMeetup = (event) => {
        event.preventDefault();
        console.log(this.state);
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
        this.props.history.push('/');
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
                                    label="Description"
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
                    <Redirect to="/" />
                }
            </>
        )
    }
}

const mapStateToProps = reduxState => ({
    selectedPin: reduxState.pins.selectedPin,
})

export default connect(mapStateToProps)(MeetupForm);



// import React, {Component} from 'react'
// import {connect} from 'react-redux'

// class Organize extends Component {

//     organizeMeetup = () => {
//         console.log(this.props.selectedPin);
//         this.props.dispatch({
//             type: 'ADD_MEETUP',
//             payload: {
//                 pinId: this.props.selectedPin.pin_id,
//                 userId: this.props.selectedPin.ref_created_by
//             }
//         })
//     }

//     render () {
//         return (
//             <>
//                 <h1>Organize Meetup</h1>
//             </>
//         )
//     }
// }

// const mapStateToProps = (reduxState) => ({
//     reduxState,
// })

// export default connect(mapStateToProps)(Organize);




