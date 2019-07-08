import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

import './ErrorPage.css'

class ErrorPage extends Component {
    render() {
        return (
            <div id="errorPage">
                <Grid container justify="center">
                    <Grid item xs={9}>
                        <h1>Oh no!</h1>
                        <h4>Something went terribly wrong!</h4>
                        <br/>
                        <h4>Country roads, take me home<br />to the place I belong.</h4>
                        <Button variant="contained" color="primary" className="medium-button-text" onClick={() => this.props.history.push('/home')}>Take me home</Button>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default ErrorPage