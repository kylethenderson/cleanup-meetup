import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class WelcomePage extends Component {
    render () {
        return (
            <div id="welcomePage">
                <h1>
                    Welcome Page
                </h1>
                <p>Here we'll talk about what CleanUp MeetUp is,
                    our goals, what we hope to achieve, and how
                    you can get involved. 
                </p>
                <Link to="/home">
                    Log In
                </Link>
            </div>
        )
    }
}

export default WelcomePage