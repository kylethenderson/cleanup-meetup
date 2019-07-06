import React, { Component } from 'react'

import './ErrorPage.css'

class ErrorPage extends Component {
    render() {
        return(
            <div id="errorPage">
                <h1>On no!</h1>
                <h4>Something went terribly wrong!</h4>
                <p>Lets get back on the proper path, shall we?</p>
                <button onClick={()=>this.props.history.push('/home')}>Take me home, country road.</button>
            </div>
        )
    }
}

export default ErrorPage