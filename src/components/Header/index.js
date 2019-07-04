import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Drawer from '@material-ui/core/Drawer'
import Icon from '@material-ui/core/Icon'
import './Header.css'

class Header extends Component {
    state = {
        drawer: false,
    }

    toggleDrawer = (open) => event => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        this.setState({ ...this.state, drawer: open });
    };

    logout = () => {
        this.props.dispatch({ type: 'LOGOUT' });
        this.toggleDrawer('left', false);
    }

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
                            {this.props.user.latitude ?
                                <Icon size="large" onClick={this.toggleDrawer(true)} id="navMenuButton">menu</Icon>
                                :
                                <Icon size="large" id="navMenuButton">menu</Icon>
                            }
                            <Drawer id="navDrawer" open={this.state.drawer}>
                                <button onClick={this.toggleDrawer(false)} className="nav-link close-drawer">
                                    <Icon onClick={this.toggleDrawer(false)}>close</Icon>
                                </button>
                                <Link onClick={this.toggleDrawer(false)} className="nav-link" to="/home">
                                    Home
                                    </Link>
                                <Link onClick={this.toggleDrawer(false)} className="nav-link" to="/my-pins">
                                    My Pins
                                    </Link>
                                <Link onClick={this.toggleDrawer(false)} className="nav-link" to="/my-meetups">
                                    My Meetups
                                    </Link>
                                <Link onClick={this.toggleDrawer(false)} className="nav-link" to="/profile">
                                    Profile
                                    </Link>
                                <button
                                    id="logoutButton"
                                    className="nav-link"
                                    onClick={this.logout}
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