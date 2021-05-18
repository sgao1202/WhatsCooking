import React, { useContext, useState } from 'react';
import { Button, Col, Image, ListGroup, Row}  from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { AuthContext } from '../firebase/Auth';
import genericProfile from '../img/generic-user-profile.jpeg';

// Props must have recipe or user prop supplied
const ListDisplay = (props) => {
    const { baseUrl } = useContext(AuthContext);
    const [list, setList] = useState(props.list);
    let currentList = null;
    const createUserItem = (user) => {
        return (
            <ListGroup.Item key={user._id}>
                <Link to={`/users/${user._id}`}>
                    <Row>
                        <Col md={1}>
                            <Image className="shadow-lg following-user-profile-picture" src={user.profilePicture ? `${baseUrl}/images/${user.profilePicture}` : genericProfile} alt={`profile-${user._id}`} roundedCircle/>
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
                <Link to={`/recipe/${recipe._id}`}>
                    <Row>
                        <Col md={1}>
                            <Image className="shadow-lg following-user-profile-picture" src={recipe.picture ? `${baseUrl}/images/${recipe.picture}` : genericProfile} alt={`recipe-${recipe.title}`} roundedCircle/>
                        </Col>
                        <Col>
                            <span>{recipe.title}</span>
                        </Col>
                    </Row>
                </Link>
            </ListGroup.Item>
        );
    };

    const removeItem = (id) => {
        console.log(id);
        // Remove from list and send a post request to update the user's profile
        const newList = list.filter((item) => item._id !== id);
        setList(newList);
    };
    
    if (props.recipe) currentList = list && list.map((item) => { return createRecipeItem(item); });
    if (props.user) currentList = list && list.map((item) => { return createUserItem(item); });

    return (
        <ListGroup variant="flush">
            {currentList}
        </ListGroup>
    );
};

export default ListDisplay;