import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Drawer from '@material-ui/core/Drawer'
import Icon from '@material-ui/core/Icon'
import './Header.css'

class Header extends Component {
    state = {
        left: false,
    }

    toggleDrawer = (side, open) => event => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        this.setState({ ...this.state, [side]: open });
    };
    render() {
        return (
            <>
                <header>
                    <Link id="mainLogo" to="/">
                        <h1>CleanUp<br />MeetUp</h1>
                    </Link>
                    {/* Only show the menu option if user is logged in */}
                    {this.props.user.id && (
                        <>
                            <Icon size="large" onClick={this.toggleDrawer('left', true)} id="navMenuButton">menu</Icon>
                            <Drawer onClick={this.toggleDrawer('left', false)} id="navDrawer" open={this.state.left}>
                                <button onClick={this.toggleDrawer('left', false)} className="nav-link close-drawer">
                                    <Icon>close</Icon>
                                </button>
                                <Link className="nav-link" to="/home">
                                    Home
                                    </Link>
                                <Link className="nav-link" to="/my-pins">
                                    My Pins
                                    </Link>
                                <Link className="nav-link" to="/my-meetups">
                                    My Meetups
                                    </Link>
                                <Link className="nav-link" to="/profile">
                                    Profile
                                    </Link>
                                <button
                                    id="logoutButton"
                                    className="nav-link"
                                    onClick={() => this.props.dispatch({ type: 'LOGOUT' })}
                                >
                                    Log Out
                                </button>
                            </Drawer>
                        </>
                    )}
                </header>
            </>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps)(Header);