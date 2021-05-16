import React, { useContext, useEffect, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Col, Container, Dropdown, Image, Navbar, Row} from 'react-bootstrap';
import { FaRegUser, FaSignOutAlt, FaEdit } from 'react-icons/fa';
import { AuthContext } from '../firebase/Auth';
import { doSignOut } from '../firebase/FirebaseFunctions';
import genericProfile from '../img/generic-user-profile.jpeg';
import logo from '../img/whats-cooking-logo.png';

const Navigation = () => {
    // If the user is not logged in then show Log In and Sign Up button in top right,
    // otherwise replace those buttons with their name and dropdown
    const { baseUrl, currentUser, currentProfile} = useContext(AuthContext);

    // Logout function
    const logout = async () => {
        await doSignOut();
    };
    
    return (
        <Navbar className="top-bar border-bottom rounded-bottom rounded-lg pt-4 px-0" bg="gray">
            <Navbar.Brand className="pt-3">
                <Link to="/">
                    <img src={logo} className="App-logo d-inline-block align-top" alt="whats-cooking-logo"></img>
                </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-brand"/>
            <Navbar.Collapse>
                    <Container></Container>
                    {/* Fix with a 3 column layout for the navigation bar */}
                    {currentUser ? 
                        <div className="mr-5 pb-2">
                            <Dropdown className="mr-5" alignRight>
                                <Dropdown.Toggle className="align-top nav-dropdown-toggle nav-profile-picture bg-primary" id="nav-dropdown-toggle" as="div">
                                    <Image className="shadow following-user-profile-picture" src={ currentProfile && currentProfile.profilePicture ? `${baseUrl}/images/${currentProfile.profilePicture}` : genericProfile} alt="nav-profile" roundedCircle/>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="p-3 shadow nav-dropdown-menu">
                                    <Dropdown.Item href="/my-profile">
                                        <Row>
                                            <Col md={2}>
                                                <FaRegUser/>
                                            </Col>
                                            <Col>
                                                <span>My Profile</span>
                                            </Col>
                                        </Row>
                                    </Dropdown.Item>
                                    <Dropdown.Item href="/my-profile/edit">
                                        <Row>
                                            <Col md={2}>
                                                <FaEdit/>
                                            </Col>
                                            <Col>
                                                <span>Edit Profile</span>
                                            </Col>
                                        </Row>
                                    </Dropdown.Item>
                                    <Dropdown.Divider/>
                                    <Dropdown.Item href="/home" onClick={logout}>
                                        <Row>
                                            <Col md={2}>
                                                <FaSignOutAlt/>
                                            </Col>
                                            <Col>
                                                <span>Log Out</span>
                                            </Col>
                                        </Row>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
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