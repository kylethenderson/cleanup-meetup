import React, { Component } from 'react'
import { connect } from 'react-redux'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Button from '@material-ui/core/Button'

class PinItem extends Component {

    handleClick = () => {
        this.props.dispatch({type: 'DELETE_PIN', payload: this.props.pin.pin_id})
    }

    render() {
        return (
            <>
                <TableRow>
                    <TableCell>
                        {this.props.pin.pin_id}
                    </TableCell>
                    <TableCell>
                        {this.props.pin.description}
                    </TableCell>
                    <TableCell>
                        <Button variant="contained" size="small" className="error-background" onClick={this.handleClick}>Delete</Button>
                    </TableCell>
                </TableRow>
            </>
        )
    }
}

export default connect()(PinItem)