import React, { Component } from 'react'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'

import './WelcomePage.css'

class WelcomePage extends Component {
    render() {
        return (
            <div id="welcomePage">
                <h3>Welcome to</h3>
                <h2>CleanUp MeetUp</h2>
                <div className="circle-container">
                    <div className="circle-border"></div>
                    <Icon id="centerIcon">public</Icon>
                    <Icon className="deg0">delete_outline</Icon>
                    <Icon className="deg50">place</Icon>
                    <Icon className="deg130">my_location</Icon>
                    <Icon className="deg180">people_outline</Icon>
                    <Icon className="deg230">home</Icon>
                    <Icon className="deg310">loop</Icon>
                </div>
                <div id="welcomeIntro">
                    <p>
                        Mark a location
                    </p>
                    <p>
                        Organize a cleanup 
                    </p>
                    <p>
                        Improve your community
                    </p>
                </div>
                <div id="buttonWrapper">
                    <Button id="letsGoButton" variant="outlined" onClick={() => this.props.history.push('/home')}>Let's Go!</Button>
                </div>
            </div>
        )
    }
}

export default WelcomePage