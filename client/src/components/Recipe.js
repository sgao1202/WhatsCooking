import React, {useState, useEffect} from 'react';
import '../App.css';
import axios from 'axios'
import { Container, ListGroup, Row, Col, Image, Button, Form, Modal } from 'react-bootstrap'
import logo from '../img/whats-cooking-logo.png';
const Recipe = (props) =>{
    /* Contents to be included:
    Name
    Author Name
    Image
    Description
    Ingredients
    Procedure
    */

   /* Core Features:
    Updating Recipe Button (only if you own the recipe)
    Add Comment to Recipe
    Display Comments of a Recipe
   */

    /* Ideas:
    add optional photo field for each ingredient/step?
    clicking on chef name will bring you to his/her profile page?
    AJAX Refresh?
    
    */
    const url = 'http://localhost:3001/';
    const [loading, setLoading] = useState(true);
    const [recipeData, setRecipeData] = useState(undefined);
    const [userData, setUserData] = useState(undefined);
    const [modal, showModal] = useState(false);
    // const [modalIngredients, addModalIngredient] = useState();
    // const [modalProcedure, addModalProcedure] = useState();

    const updateRecipe = () => showModal(true);
    const closeModal = () => showModal(false);
    const addIngredient = () => {
        
    }
    const addStep = () => {
        
    }

    useEffect(() =>{
        async function fetchData(){
            try{
                let { data } = await axios.get(`${url}recipes/${props.match.params.id}`); //getRecipeById
                console.log(data);
                setRecipeData(data);
                let user = await axios.get(`${url}users/${recipeData.userId}`);
                setUserData(user.data);
                setLoading(false);
            }catch(e){
                console.log(e);
            }
        }
        fetchData();
    }, [props.match.params.id])
    
    if (loading){
        return(
            <h1>Loading...</h1>
        )
    }
    else{
        let ingredients = recipeData.ingredients.map((ingredient)=>(
            <ListGroup.Item key={ingredient.name} as="li" className='ingredient'>
                {ingredient.name}: {ingredient.portion} {ingredient.units}
            </ListGroup.Item>
        ))
        let procedure = recipeData.procedure.map((step)=>(
            <ListGroup.Item key={step} as="li" className='procedure'>
                {step}
            </ListGroup.Item>
        ))
        return (
            <Container>
                <Row>
                    <Col>
                        <h1 id='recipe-title'>{recipeData.title}</h1>
                        <h2 id='recipe-chef'>Posted By: {userData.firstName} {userData.lastName}</h2>
                        <br></br>
                        <p id='recipe-desc'>{recipeData.description}</p>
                    </Col>
                    <Col xs={2}>
                        <Button onClick={updateRecipe}>Update Recipe</Button>
                        <Modal show={modal} onHide={closeModal}>
                        <Modal.Header closeButton>
                        <Modal.Title>Update {recipeData.title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="updateTitle">
                                    <Form.Label>Name:</Form.Label>
                                    <Form.Control type="text" placeholder={recipeData.title}></Form.Control>
                                </Form.Group>
                                <Form.Group controlId="displayChef">
                                    <Form.Label>Chef:</Form.Label>
                                    <Form.Control plaintext readOnly defaultValue={userData.firstName + " " + userData.lastName}/>
                                </Form.Group>
                                <Form.Group controlId="updateDesc">
                                    <Form.Label>Description:</Form.Label>
                                    <Form.Control type="text" placeholder={recipeData.description}></Form.Control>
                                </Form.Group>
                                <Form.Group controlId="updateIngredients">
                                    <Form.Label>Ingredients:</Form.Label>
                                    <Form.Row>
                                        <Col>
                                            <Form.Control type="text" placeholder="Sugar"></Form.Control>
                                        </Col>
                                        <Col>
                                            <Form.Control type="number" placeholder={0}></Form.Control>
                                        </Col>
                                        <Col>
                                            <Form.Control type="text" placeholder="tsps"></Form.Control>
                                        </Col>
                                    </Form.Row>
                                    <Button onClick={addIngredient}>Add +</Button>
                                </Form.Group>
                                <Form.Group controlId="updateProcedure">
                                    <Form.Label>Procedure:</Form.Label>
                                    <Form.Control type="text" placeholder={recipeData.procedure[0]}></Form.Control>
                                    <Button onClick={addStep}>Add +</Button>
                                </Form.Group>

                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={closeModal}>
                            Save Changes
                        </Button>
                        </Modal.Footer>
                    </Modal>
                    </Col>
                    <Col xs={6} md={4}>
                        <Image src={logo} alt = "noimg" thumbnail="true"></Image>
                    </Col>
                </Row>
                
                <h3>Ingredients:</h3>
                <ListGroup as="ul">
                    {ingredients}
                </ListGroup>
                <br></br>
                <h3>Procedure:</h3>
                <ListGroup as="ol">
                    {procedure}
                </ListGroup>
                <br></br>
                <Form>
                    <Form.Group controlId="addComment">
                        <Form.Control type="text" placeholder="Add a public comment..."/>
                    </Form.Group>
                    <Button>Comment</Button>
                </Form>
            </Container>
        )
    }
    
}
export default Recipe;