import React, {useState, useEffect} from 'react';
import '../App.css';
import axios from 'axios'
import { Container, Row, Col, Image, Button, Form, ListGroup } from 'react-bootstrap'
import logo from '../img/whats-cooking-logo.png';
import EditRecipeModal from './EditRecipeModal';
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
    Display Photos
   */

    /* Bugs
    Closing Modals: revert state change necessary
    Deletion of entire data field (patch route)
    Form validation
    DB: headers sent to client multiple times
    */

    /*UIUX Necessary
    add steps between procedures
    alert when leaving modal
     */

    /* Ideas:
    add optional photo field for each ingredient/step?
    clicking on chef name will bring you to his/her profile page?
    */
    const url = 'http://localhost:3001/';
    const [loading, setLoading] = useState(true);
    const [recipeData, setRecipeData] = useState();
    const [userData, setUserData] = useState();
    const [commentData, setCommentData] = useState();
    const [errors, setErrors] = useState();
    // const [modalData, setModalData] = useState();

    const [showEditModal, setShowEditModal] = useState(false);
    
    const initialCommentData = Object.freeze({
        comment: ""
    });
    const [comment, submitComment] = useState(initialCommentData);
    const updateRecipe = () => setShowEditModal(true);
    const updateModal = (data) => setRecipeData(data);
    const closeModal = () => setShowEditModal(false);
    const handleChange = (e) =>{
        submitComment({
            ...comment, [e.target.name]: e.target.value.trim()
        });
    }
    async function handleSubmit(e){
        if (comment.comment.trim().length === 0) {
            e.preventDefault();
            setErrors("Comment cannot be empty!");
            return;
        }
        try{
            let newComment = await axios.post(`${url}comments`, {
                comment: comment.comment,
                recipeId: recipeData._id,
                userId: "608483eb3f1a062020344720"
            });
            //add new comment to commentList and re-render
            let comments = commentData;
            comments.push(newComment.data);
            setCommentData(comments);
        }catch(e){
            console.log(e);
        }
        return;
    }
    
    useEffect(() =>{
        async function fetchData(){
            try{
                //get recipe data
                let { data } = await axios.get(`${url}recipes/${props.match.params.id}`); //getRecipeById
                setRecipeData(data);
                //get user data associated with recipe
                let user = await axios.get(`${url}users/${data.userId}`);
                setUserData(user.data);
                //get all comments associated with recipe
                let comments = await axios.get(`${url}comments/recipe/${props.match.params.id}`);

                //get user name for the comment data
                let recipeComments = comments.data;
                recipeComments.forEach(async(comment)=>{
                    let userName = await axios.get(`${url}users/${comment.userId}`);
                    comment.userId = userName.data.firstName + " " + userName.data.lastName;
                })
                setCommentData(recipeComments);
                setLoading(false);
            }catch(e){
                console.log(e);
            }
        }
        fetchData();
    }, [props.match.params.id]);

    
    if (loading){
        return(
            <h1>Loading...</h1>
        )
    }
    else{
        let ingredients = recipeData.ingredients.map((ingredient)=>(
            <li key={ingredient.name} className='ingredient'>
                {ingredient.name}: {ingredient.portion} {ingredient.units}
            </li>
        ));
        let procedure = recipeData.procedure.map((step)=>(
            <li key={step} className='procedure'>
                {step}
            </li>
        ));

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
                        <EditRecipeModal isOpen={showEditModal} data={recipeData} user={userData} closeModal={closeModal} updateModal={updateModal}></EditRecipeModal>
                    </Col>
                    <Col xs={6} md={4}>
                        <Image src={logo} alt = "noimg" thumbnail="true"></Image>
                    </Col>
                </Row>
                
                <h3>Ingredients:</h3>
                <ul>
                    {ingredients}
                </ul>
                <br></br>
                <h3>Procedure:</h3>
                <ol>
                    {procedure}
                </ol>
                <br></br>
                <Form>
                    <Form.Group controlId="addComment" onSubmit={handleSubmit}>
                        <Form.Control name='comment' type="text" placeholder="Add a public comment..." onChange={handleChange}/>
                    </Form.Group>
                    {errors && <p className='error'>{errors}</p>}
                    <Button type='submit' onClick={handleSubmit}>Comment</Button>
                </Form>
                <br></br>
                <h4>Comments:</h4>
                <hr></hr>
                <ListGroup>
                {commentData.map((comment)=>(
                    <ListGroup.Item key={comment._id} as="li">
                        <Container>
                            <Row>
                                <span className="user-comment-name">{comment.userId}</span>
                            </Row>
                            <Row>
                                <span>{comment.comment}</span>
                            </Row>
                        </Container> 
                    </ListGroup.Item>
                ))}
                </ListGroup>
            </Container>
        )
    }
    
}
export default Recipe;