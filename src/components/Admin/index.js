import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import './AdminView.css'

class AdminView extends Component {
    componentDidMount() {
        this.props.dispatch({type: 'FETCH_MEETUPS'});
    }

    render() {
        return (
            <div id="adminView">
                { this.props.user.admin ? 
                    <>
                        <h2>Admin</h2>
                        <h3>Pins</h3>
                        <pre>
                            {JSON.stringify(this.props.pins, null, 2)}
                        </pre>
                        <h3>Meetups</h3>
                        <pre>
                            {JSON.stringify(this.props.meetups, null, 2)}
                        </pre>
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