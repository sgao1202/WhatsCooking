import React, {useContext, useState, useEffect} from 'react';
import { AuthContext } from '../firebase/Auth';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Nav, Tab, ListGroup, Spinner, Image} from 'react-bootstrap';
import { FaBookmark, FaCamera, FaRegNewspaper, FaUser, FaUserFriends, FaUtensils } from 'react-icons/fa';
import ListDisplay from './ListDisplay';
import genericProfile from '../img/generic-user-profile.jpeg';
import axios from 'axios';

const MyProfile = () => {
    const { currentUser, baseUrl } = useContext(AuthContext);
    const [userProfile, setUserProfile] = useState(undefined);
    const [myRecipes, setMyRecipes] = useState(undefined);
    const [following, setFollowing] = useState(undefined);
    const [bookmarkedRecipes, setBookmarkedRecipes] = useState(undefined);
    const [loading, setLoading] = useState(true);

    // Fetch user data from server
    useEffect(() => {
        document.title = "My Profile";
        // Fetch data from db
        async function fetchData() {
            setLoading(true);
            try {
                // Get user from database
                const { data } = await axios.get(`${baseUrl}/users/my-profile/${currentUser.uid}`);
                setUserProfile(data.user);
                setMyRecipes(data.myRecipes);
                setFollowing(data.following);
                setBookmarkedRecipes(data.bookmarkedRecipes);
            } catch (e) {
                console.log(e);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    /* fields to display 
        First Name
        Last Name
        Profile Picture
        Bookmarks
        Following (should we have links to their account page? but with no editing allowed?)
        About Me
        My Recipes
    */

    if (loading) return (
        <Container className="text-center">
            <Spinner animation="border"></Spinner>
        </Container>
    );
    return (
        <Container>
            <Row className="mb-5 border-bottom">
                <Col className="py-3">
                    <Row>
                        <Col className="pr-0">
                            <Image className="border shadow my-profile-image"src={userProfile && userProfile.profilePicture ? `${baseUrl}/images/${userProfile.profilePicture}` : genericProfile} alt="profile-picture" roundedCircle/>
                        </Col>    
                        <Col>
                            <Row>
                                <h1>{`${userProfile.firstName} ${userProfile.lastName}`}</h1>    
                            </Row>
                            <Row>
                                <ListGroup horizontal>
                                    <ListGroup.Item>
                                        <span className="mr-2"><FaUtensils></FaUtensils></span>
                                        <span className="font-weight-bold mr-1">{myRecipes.length}</span>
                                        <span>Recipes</span>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <span className="mr-2"><FaBookmark></FaBookmark></span>
                                        <span className="font-weight-bold mr-1">{bookmarkedRecipes.length}</span> 
                                        <span>Bookmarks</span>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col lg={3} className="my-5 border-left">
                    <Container>
                        <Link to='/my-profile/upload-image'>
                            <Row className="mb-3">
                                <div className="col-2 pr-0">
                                    <span><FaCamera></FaCamera></span>
                                </div>
                                <div className="col-10 pl-0">
                                    <span>Upload Profile Picture</span>
                                </div>
                            </Row>
                        </Link>
                        <Link to="/my-profile/edit">
                            <Row className="mb-3">
                                <div className="col-2 pr-0">
                                    <span><FaRegNewspaper></FaRegNewspaper></span>
                                </div>
                                <div className="col-10 pl-0">
                                    <span>Update Your Profile</span>
                                </div>
                            </Row>
                        </Link>
                    </Container>
                </Col>
            </Row>
            <Tab.Container defaultActiveKey="aboutMe">
                <Row>
                    <Col sm={3} className="pl-0">
                        <h1 className="h5">{`${userProfile.firstName}`}'s Profile</h1>
                        <Nav variant="pills" className="flex-column profile-nav">
                            <Nav.Item className="border-bottom">
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
                            <Nav.Item className="border-bottom">
                                <Nav.Link eventKey="myRecipes">
                                    <Row>
                                        <div className="col-2 pr-0">
                                            <span><FaUtensils></FaUtensils></span> 
                                        </div>
                                        <div className="col-10 pl-0">
                                            <span>Recipes</span>
                                        </div>
                                    </Row>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="border-bottom">
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
                            <Nav.Item className="border-bottom">
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
                                <div>
                                    <h2 className="pb-2 border-bottom text-primary">About Me</h2>
                                </div>
                                <div>
                                    {userProfile.aboutMe ? userProfile.aboutMe : <h3>Nothing to display</h3>}
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="myRecipes">
                                <div>
                                    <h2 className="pb-2 border-bottom text-primary">My Recipes</h2>
                                </div>
                                <div>
                                    { myRecipes.length === 0 ? <h3>You have not created any recipes yet</h3> :
                                        (<ListDisplay recipe list={myRecipes}/>)
                                    }
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="following">
                                <div>
                                    <h2 className="pb-2 border-bottom text-primary">Following</h2>
                                </div>
                                <div>
                                    {userProfile.following.length === 0 ? <h3>No followers available</h3> : 
                                        (<ListDisplay user list={following}/>)
                                    }
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="bookmarks">
                                <div>
                                    <h2 className="pb-2 border-bottom text-primary">Bookmarks</h2>
                                </div>
                                <div>
                                    { bookmarkedRecipes.length === 0 ? <h3>No bookmarks available</h3> : 
                                        (<ListDisplay recipe list={bookmarkedRecipes}/>)
                                    }
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    )

}

export default MyProfile;