import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import MeetupItem from './MeetupItem'
import PinItem from './PinItem'
import './AdminView.css'

class AdminView extends Component {
    componentDidMount() {
        this.props.dispatch({ type: 'FETCH_MEETUPS' });
    }

    render() {
        return (
            <div id="adminView">
                {this.props.user.admin ?
                    <>
                        <h2>Admin</h2>
                        <h3>Pins</h3>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Pin Id</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.props.pins.map(pin => <PinItem key={pin.pin_id} pin={pin} />)}
                            </TableBody>
                        </Table>
                        <h3>Meetups</h3>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Meetup Id</TableCell>
                                    <TableCell>Date/Time</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.props.meetups.map(meetup => <MeetupItem key={meetup.meetup_id} meetup={meetup} />)}
                            </TableBody>
                        </Table>
                    </>
                    :
                    <Redirect to="/home" />
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    meetups: state.meetups.allMeetups,
    pins: state.pins.pinList,
})

export default connect(mapStateToProps)(AdminView);