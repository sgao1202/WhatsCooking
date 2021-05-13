import React, {useState, useEffect, useContext} from 'react';
import { AuthContext } from '../firebase/Auth';
import { Redirect } from 'react-router-dom'
import '../App.css';
import axios from 'axios'
import { Container, Row, Col, Image, Button, Form, ListGroup } from 'react-bootstrap'
import logo from '../img/whats-cooking-logo.png';
import EditRecipeModal from './EditRecipeModal';
const Recipe = (props) =>{
   /* Core Features still need to be implemented:
    Updating Recipe Button (only if you are logged in as the owner of the recipe)
    Pull photos from database for page
   */

  /*Need:
  users in mongodb
  photos in database
  */

    /* Bugs
    Form validation
    DB: headers sent to client multiple times
    */

    /* Ideas:
    add optional photo field for each ingredient/step?
    clicking on chef name will bring you to his/her profile page?
    */
    const { currentUser } = useContext(AuthContext);
    const url = 'http://localhost:3001/';
    const [loading, setLoading] = useState(true);
    const [recipeData, setRecipeData] = useState();
    const [userData, setUserData] = useState();
    const [commentData, setCommentData] = useState();
    const [errors, setErrors] = useState();
    const [redirect, setRedirect] = useState(false);

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
    const redirectToLogin = (e) =>{ setRedirect(true) }
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
                userId: "609705b47f772731c31ed661"
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

    if (redirect){
        return <Redirect to='/login'></Redirect>
    }
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
                    {currentUser && <Col xs={2}>
                        <Button onClick={updateRecipe}>Update Recipe</Button>
                        <EditRecipeModal isOpen={showEditModal} data={recipeData} user={userData} closeModal={closeModal} updateModal={updateModal}></EditRecipeModal>
                    </Col>}
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
                    <Button type='submit' onClick={currentUser? (e)=>handleSubmit(e): (e)=>redirectToLogin(e)}>Comment</Button>
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