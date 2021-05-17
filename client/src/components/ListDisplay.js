import React, { useContext, useState } from 'react';
import { Button, Col, ListGroup, Row}  from 'react-bootstrap';
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
                <Row>
                    <Col md={3}>
                        <img className="following-user-profile-picture border" src={user.profilePicture ? `${baseUrl}/images/${user.profilePicture}` : genericProfile} alt={`profile-${user._id}`}/>
                    </Col>
                    <Col>
                        <span>{`${user.firstName} ${user.lastName.charAt(0)}`}</span>
                    </Col>
                </Row>
            </ListGroup.Item>
        );
    };

    const createRecipeItem = (recipe) => {
        return (
            <ListGroup.Item key={recipe._id}>
                <div className="row">
                    <div className="col">
                        <Link to={`/recipe/${recipe._id}`}>
                            {recipe.title}
                        </Link>
                    </div>
                    {/* <div className="col">
                        <Button variant="danger" onClick={() => removeItem(recipe._id)}>
                            <FaTrash></FaTrash>
                        </Button>
                    </div> */}
                </div>
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