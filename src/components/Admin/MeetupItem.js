import React, { Component } from 'react'
import { connect } from 'react-redux'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Button from '@material-ui/core/Button'

class MeetupItem extends Component {

    handleClick = () => {
        console.log('deleting meetup', this.props.meetup.meetup_id)
        this.props.dispatch({ type: 'DELETE_MEETUP', payload: this.props.meetup.meetup_id });
    }

    render() {
        return (
            <>
                {this.props.meetup &&
                    <TableRow>
                        <TableCell>
                            {this.props.meetup.meetup_id}
                        </TableCell>
                        <TableCell>
                            {this.props.meetup.date.substring(5, 7) + "/" + this.props.meetup.date.substring(8, 10) + "/" + this.props.meetup.date.substring(0, 4)} - {this.props.meetup.time}
                        </TableCell>
                        <TableCell>
                            <Button variant="contained" size="small" className="error-background" onClick={this.handleClick}>Delete</Button>
                        </TableCell>
                    </TableRow>
                }
            </>
        )
    }
}

export default connect()(MeetupItem)