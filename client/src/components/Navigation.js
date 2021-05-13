import React, { useContext, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Col, Container, Dropdown, DropdownButton, Navbar, Row} from 'react-bootstrap';
import { AuthContext } from '../firebase/Auth';
import { doSignOut } from '../firebase/FirebaseFunctions';
import logo from '../img/whats-cooking-logo.png';
import genericProfile from '../img/generic-user-profile.jpeg';

const Navigation = () => {
    // If the user is not logged in then show Log In and Sign Up button in top right,
    // otherwise replace those buttons with their name and dropdown
    const { currentUser } = useContext(AuthContext);
    console.log(currentUser);
    
    // Logout function
    const logout = async () => {
        await doSignOut();
    };
    
    return (
        <Navbar className="top-bar border-bottom rounded-bottom rounded-lg pt-4" bg="gray">
            <Navbar.Brand>
                <Link to="/">
                    <img src={logo} className="App-logo d-inline-block align-top" alt="whats-cooking-logo"></img>
                </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-brand"/>
            <Navbar.Collapse>
                    <Container></Container>
                    {/* Fix with a 3 column layout for the navigation bar */}
                    {currentUser ? 
                        <div>
                            <Link className="mr-5 pb-2" to="/newrecipe">
                                <Button>Create Recipe</Button>
                            </Link>
                            <DropdownButton id="nav-dropdown" variant="outline-primary" className="mr-5 pb-2" title={currentUser.displayName} menuAlign="right">
                                <Dropdown.Item href="/profile">My Profile</Dropdown.Item>
                                <Dropdown.Divider/>
                                <Dropdown.Item href="/home" onClick={logout}>Log Out</Dropdown.Item>
                            </DropdownButton> 
                        </div>
                        : 
                        <div className="mr-5">
                            <Link className="mr-3" to="/login">
                                <Button variant="outline-primary">Log In</Button>
                            </Link>
                            <Link className="mr-3"to="/signup">
                                <Button variant="primary">Sign Up</Button>
                            </Link>
                        </div>
                    }
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Navigation;