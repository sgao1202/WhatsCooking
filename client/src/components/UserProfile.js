import React, {useContext, useState, useEffect} from 'react';
import { AuthContext } from '../firebase/Auth';
import { Link, Redirect } from 'react-router-dom';
import { Container, Row, Col, Nav, Tab, ListGroup, Spinner, Image} from 'react-bootstrap';
import {FiUserPlus} from 'react-icons/fi';
import {FaUserMinus, FaBookmark, FaCamera, FaRegNewspaper, FaUser, FaUserFriends, FaUtensils } from 'react-icons/fa';
import genericProfile from '../img/generic-user-profile.jpeg';
import axios from 'axios';
import ListDisplay from './ListDisplay';
import Error from './Error'

const UserProfile = (props) => {
    const { currentUser, baseUrl } = useContext(AuthContext);
    const [userProfile, setUserProfile] = useState(undefined);
    const [bookmarkedRecipes, setBookmarkedRecipes] = useState(undefined);
    const [myRecipes, setMyRecipes] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [redirect, setRedirect] = useState(false);
    const [hasError, setHasError] = useState(false);
    const url = baseUrl;

    const [following, setFollowing] = useState();

    const redirectToLogin = () =>{ setRedirect(true) }

    // Fetch user data from server
    useEffect(() => {
        document.title = "User Profile";
        // Fetch data from db
        async function fetchData() {
            setLoading(true);
            let u = null;
            try {
                // Get user from database
                const { data } = await axios.get(`${baseUrl}/users/my-profile/${String(props.match.params.id)}`);
                u = data;
                //let u = r.data;
            } catch (e) {
                console.log(e)
                setHasError(true);
                setLoading(false);
                return;
            }
            let data = u;
                setUserProfile(data.user);
                setBookmarkedRecipes(data.bookmarkedRecipes);
                setMyRecipes(data.myRecipes);
                
                if (currentUser) {
                    let r = await axios.get(`${url}users/uid/${currentUser.uid}`);
                    setFollowing(r.data.following.includes(String(data.user._id)));
                }
            setLoading(false);
        }
        fetchData();
    }, []);

    const toggleFollowing = async(e) => {
        let followInfo = {
            followUserId: String(userProfile._id)//String(props.match.params.id)
        }

        e.preventDefault();
        if(!following){
            try{
                let r = await axios.get(`${url}users/uid/${currentUser.uid}`, followInfo);
                let u = r.data;
                await axios.post(`${url}users/${u._id}/following`, followInfo);
                setFollowing(true);
            }catch(e){
                console.log(e.error)
            }
        }else{
            try{
                let r = await axios.get(`${url}users/uid/${currentUser.uid}`, followInfo);
                let u = r.data;
                await axios.delete(`${url}users/${u._id}/following/${String(userProfile._id)}`)
                setFollowing(false);
            }catch(e){
                console.log(e);
            }
        }
    }

    /* fields to display 
        First Name
        Last Name
        Profile Picture
        Bookmarks
        Following (should we have links to their account page? but with no editing allowed?)
        About Me
        My Recipes
    */
    if (loading) {
        return (
        <Container className="text-center">
            <Spinner animation="border"></Spinner>
        </Container>
        );
    } else if(hasError) {
        return <Error/>
    }

    let followButton = null;
    if (currentUser && currentUser.uid != userProfile.uid) {
        if (currentUser && !following) {
            followButton = <FiUserPlus size={40} onClick={currentUser? (e)=>toggleFollowing(e): ()=>redirectToLogin()}></FiUserPlus>;
        } else if (currentUser && following) {
            followButton = <FaUserMinus size={40}  onClick={currentUser? (e)=>toggleFollowing(e): ()=>redirectToLogin()}></FaUserMinus>
        }
    }
    
    return (
        <Container>
            <Row className="mb-5 border-bottom">
                <Col className="py-3">
                    <Row>
                        <Col>
                            <Image className="my-profile-image"src={userProfile.profilePicture ? `${url}images/${userProfile.profilePicture}` : genericProfile} alt="profile-picture" roundedCircle/>
                        </Col>    
                        <Col>
                            <Row>
                                <Col>
                                <h1>{`${userProfile.firstName} ${userProfile.lastName}`}&nbsp;&nbsp;{followButton}</h1> 
                                </Col>   
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
                                            <span>About {userProfile.firstName}</span>
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

export default UserProfile;