import React, { useContext, useState } from 'react';
import { Button, Col, Image, ListGroup, Row}  from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { AuthContext } from '../firebase/Auth';
import genericProfile from '../img/generic-user-profile.jpeg';

// Props must have recipe or user prop supplied
const ListDisplay = (props) => {
    const { baseUrl, currentUser } = useContext(AuthContext);
    const [list, setList] = useState(props.list);
    let currentList = null;

    const createUserItem = (user) => {
        return (
            <ListGroup.Item key={user._id}>
                <Link to={`/users/${user._id}`}>
                    <Row>
                        <Col md={1}>
                            <Image className="shadow-lg following-user-profile-picture" src={user.profilePicture ? `${baseUrl}images/${user.profilePicture}` : genericProfile} alt={`profile-${user._id}`} roundedCircle/>
                        </Col>
                        <Col>
                            <span>{`${user.firstName} ${user.lastName.charAt(0)}`}</span>
                        </Col>
                    </Row>
                </Link>
            </ListGroup.Item>
        );
    };

    const createRecipeItem = (recipe) => {
        return (
            <ListGroup.Item key={recipe._id}>
                    <Row>
                        <Col md={1} className="mr-3">
                            <Image className="shadow-lg following-user-profile-picture" src={recipe.picture ? `${baseUrl}images/${recipe.picture}` : genericProfile} alt={`recipe-${recipe.title}`} roundedCircle/>
                        </Col>
                        <Col>
                            <Row>
                                <Link to={`/recipe/${recipe._id}`}>
                                    <span>{recipe.title}</span>
                                </Link>
                            </Row>
                            <Row>
                                <span className="font-italic text-dark">{`Created by: ` + recipe.name}</span>
                            </Row>
                        </Col>
                    </Row>
            </ListGroup.Item>
        );
    };

    const createBookmarkItem = (bookmark) => {
        return (
            <ListGroup.Item key={bookmark._id}>
                    <Row>
                        <Col md={1} className="mr-3">
                            <Image className="shadow-lg following-user-profile-picture" src={bookmark.picture ? `${baseUrl}images/${bookmark.picture}` : genericProfile} alt={`recipe-${bookmark.title}`} roundedCircle/>
                        </Col>
                        <Col>
                            <Row>
                                <Link to={`/recipe/${bookmark._id}`}>
                                    <span>{bookmark.title}</span>
                                </Link>
                            </Row>
                            <Row>
                                <Link to={`/users/${bookmark.userId}`}>
                                    <span className="font-italic text-dark">{`Created by: ${bookmark.createdBy}`}</span>
                                </Link>
                            </Row>
                        </Col>
                    </Row>
            </ListGroup.Item>
        );
    };
    
    // const removeItem = (id) => {
    //     console.log(id);
    //     // Remove from list and send a post request to update the user's profile
    //     const newList = list.filter((item) => item._id !== id);
    //     setList(newList);
    // };
    
    if (props.recipe) currentList = list && list.map((item) => { return createRecipeItem(item); });
    if (props.user) currentList = list && list.map((item) => { return createUserItem(item); });
    if (props.bookmark) currentList = list && list.map((item) => { return createBookmarkItem(item); });
    return (
        <ListGroup variant="flush">
            {currentList}
        </ListGroup>
    );
};

export default ListDisplay;