import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import { AuthContext } from '../firebase/Auth';
import logo from '../img/whats-cooking-logo.png';

const Navigation = () => {
    // If the user is not logged in then show Log In and Sign Up button in top right,
    // otherwise replace those buttons with their name and dropdown
    const { currentUser } = useContext(AuthContext);
    console.log(currentUser);
    return (
        <Navbar className="top-bar border-bottom rounded-bottom rounded-lg pt-4" bg="gray">
            <Navbar.Brand>
                <Link to="/">
                    <img src={logo} className="App-logo d-inline-block align-top" alt="whats-cooking-logo"></img>
                </Link>
            </Navbar.Brand>
            <Navbar.Toggle/>
            <Navbar.Collapse>
                
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Navigation;