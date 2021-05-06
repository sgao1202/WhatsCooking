import React, {useContext, useState, useEffect} from 'react';
import { AuthContext } from '../firebase/Auth';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col, Nav, Tab } from 'react-bootstrap';
import { FaBookmark, FaUser, FaUserFriends } from 'react-icons/fa';
import axios from 'axios';

const Profile = () => {
    const { currentUser } = useContext(AuthContext);
    const [userData, setUserData] = useState(undefined);
    const [loading, setLoading] = useState(true);

    // Fetch user data from server
    useEffect(() => {
        document.title = "My Profile";
        async function fetchUser() {
            setLoading(true);
            // axios call to server
            setLoading(false);
        }
        fetchUser();
    }, []);

    /*
        must check for authorized account via firebase, then render.
        useContext to propogate user down to all child components
    */
    // Redirect to login page if the user tries to access this route without being authenticated
    if (!currentUser) return <Redirect to='/login'></Redirect>

    /* fields to display 
        First Name
        Last Name
        Profile Picture
        Bookmarks
        Following (should we have links to their account page? but with no editing allowed?)
        About Me
        My Recipes
    */
    if (loading) return <div>Loading...</div>
    return (
        <Container>
            <Row>
                <p>1st Row</p>
            </Row>
            <Tab.Container defaultActiveKey="aboutMe">
                <Row>
                    <Col sm={3} className="pl-0">
                        <h5>{currentUser.displayName}'s Profile</h5>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="aboutMe">
                                    <Row>
                                        <div className="col-2 pr-0">
                                            <span><FaUser></FaUser></span> 
                                        </div>
                                        <div className="col-10 pl-0">
                                            <span>About Me</span>
                                        </div>
                                    </Row>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="myRecipes">
                                    <Row>
                                        <div className="col-2 pr-0">
                                            <span><FaBookmark></FaBookmark></span> 
                                        </div>
                                        <div className="col-10 pl-0">
                                            <span>Recipes</span>
                                        </div>
                                    </Row>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="following">
                                    <Row>
                                        <div className="col-2 pr-0">
                                            <span><FaUserFriends></FaUserFriends></span> 
                                        </div>
                                        <div className="col-10 pl-0">
                                            <span>Following</span>
                                        </div>
                                    </Row>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="bookmarks">
                                    <Row>
                                        <div className="col-2 pr-0">
                                            <span><FaBookmark></FaBookmark></span> 
                                        </div>
                                        <div className="col-10 pl-0">
                                            <span>Bookmarks</span>
                                        </div>
                                    </Row>
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="aboutMe">
                                <p>This is the about me section</p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="myRecipes">
                                <p>This is the my recipes section</p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="following">
                                <p>This is the following section</p>
                            </Tab.Pane>
                            <Tab.Pane eventKey="bookmarks">
                                <p>This is the bookmarks section</p>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    )

}

export default Profile;