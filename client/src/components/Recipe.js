import React, {useState, useEffect, useContext} from 'react';
import { AuthContext } from '../firebase/Auth';
import { Link, Redirect } from 'react-router-dom'
import '../App.css';
import axios from 'axios'
import { Container, Row, Col, Image, Button, Form, ListGroup } from 'react-bootstrap'
import { BsFillBookmarkFill, BsBookmark} from 'react-icons/bs'
import { Rating } from "@material-ui/lab";
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
    

    /**
     * Image Uploading
     * <form method="post" enctype="multipart/form-data" action="/uploadImage”>
            <input type="file" name="file">
            <input type="submit" value="Submit">
        </form>
     */
    const { currentUser } = useContext(AuthContext);
    const url = 'http://localhost:3001/';
    const [loading, setLoading] = useState(true);
    const [recipeData, setRecipeData] = useState();
    const [userData, setUserData] = useState();
    const [commentData, setCommentData] = useState();
    const [errors, setErrors] = useState();
    const [redirect, setRedirect] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [userRatingId, setUserRatingId] = useState(undefined);
    const [averageRating, setAverageRating] = useState(0);

    const [showEditModal, setShowEditModal] = useState(false);
    
    const initialCommentData = Object.freeze({
        comment: ""
    });
    const [comment, setComment] = useState(initialCommentData);
    const updateRecipe = () => setShowEditModal(true);
    const updateModal = (data) => setRecipeData(data);
    const closeModal = () => setShowEditModal(false);
    const redirectToLogin = () =>{ setRedirect(true) }

    const [bookmarked, setBookmarked] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const toggleBookmarks = async(e) => {
        //REPLACE WITH USER UID WHEN IMPLEMENTED
        e.preventDefault();
        if(!bookmarked){
            try{
                await axios.post(`${url}users/${currentUser.uid}/bookmarks`, recipeData);
                setBookmarked(true);
            }catch(e){
                console.log(e.error)
            }
        }else{
            try{
                await axios.delete(`${url}users/${currentUser.uid}/bookmarks/${recipeData._id}`)
                setBookmarked(false);
            }catch(e){
                console.log(e);
            }
        }
    }

    const handleChange = (e) =>{
        setComment({
            ...comment, [e.target.name]: e.target.value
        });
        setSubmitted(false);
        setErrors("");
    }

    const handleRating = async (event, newValue) => {
        let ratingData = {
            userId: currentUser.uid,
            recipeId: props.match.params.id,
            rating: newValue
        }
        if(!userRatingId) {
            let {data} = await axios.post(`${url}ratings`, ratingData);
            setUserRatingId(data._id)
        } else {
            await axios.put(`${url}ratings/${userRatingId}`, ratingData);
        }
        setUserRating(newValue);
    }
    
    async function handleSubmit(e){
        e.preventDefault();
        //REPLACE WITH USER UID WHEN IMPLEMENTED
        if (comment.comment.trim().length === 0) {
            e.preventDefault();
            setErrors("Comment cannot be empty!");
            return;
        }
        try{
            let user = await axios.get(`${url}users/uid/${currentUser.uid}`);
            let newComment = await axios.post(`${url}comments`, {
                comment: comment.comment,
                recipeId: recipeData._id,
                userId: user.data._id
            });
            newComment.data.userName = user.data.firstName + " " + user.data.lastName;
            //add new comment to commentList and re-render
            let comments = [...commentData];
            // comments.push(newComment.data);
            comments.push(newComment.data)
            setCommentData(comments);
            
            setComment(initialCommentData);
            setSubmitted(true);
            
        }catch(e){
            console.log(e);
        }
        return;
    }

    async function getAverageRating() {
        let { data } = await axios.get(`${url}ratings/recipe/${props.match.params.id}`);
        var ratingTotal = data.reduce(function(prev, cur) {
            return prev + cur.rating;
          }, 0);
        setAverageRating(parseInt(ratingTotal/data.length));
    }
    
    useEffect(() =>{
        async function fetchData(){
            try{
                let { data } = await axios.get(`${url}recipes/${props.match.params.id}`); //getRecipeById
                setRecipeData(data);
                //get user data associated with recipe
                let user = await axios.get(`${url}users/${data.userId}`);
                setUserData(user.data);
                //get all comments associated with recipe
                let comments = await axios.get(`${url}comments/recipe/${props.match.params.id}`);
                //check if user has this page bookmarked
                user.data.bookmarks.includes(data._id)? setBookmarked(true) : setBookmarked(false);

                //get user name for the comment data
                let recipeComments = comments.data;
                Promise.all(recipeComments.map(async(comment)=>{
                    try{
                        let userName = await axios.get(`${url}users/${comment.userId}`);
                        comment.userName = userName.data.firstName + " " + userName.data.lastName;
                    }catch(e){
                        console.log(e)
                    }
                    
                })).then((data)=>{
                    setCommentData(recipeComments);
                    setLoading(false);
                })
            }catch(e){
                return (<p>{e.message}</p>)
            }
        }

        async function getUserRating() {
            let { data } = await axios.get(`${url}ratings/recipe/${props.match.params.id}/user/${currentUser.uid}`);
            setUserRatingId(data._id);
            setUserRating(data.rating);
        }
        fetchData();
        if(currentUser) {
            getUserRating();
        }
        getAverageRating();
    }, [props.match.params.id]);

    useEffect(() =>{
        getAverageRating();
    }, [userRating]);

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
                        <span>
                        <h1 id='recipe-title'>{recipeData.title}
                        {!bookmarked || !currentUser?<BsBookmark onClick={currentUser? (e)=>toggleBookmarks(e): ()=>redirectToLogin()}></BsBookmark> : <BsFillBookmarkFill className='filled' onClick={currentUser? (e)=>toggleBookmarks(e): ()=>redirectToLogin()}></BsFillBookmarkFill>}</h1>
                        </span>
                        <h2 id='recipe-chef'>
                            Posted By: 
                            <Link to={`/users/${userData._id}`}> {userData.firstName} {userData.lastName}</Link>
                            </h2>
                        <br></br>
                        <p id='recipe-desc'>{recipeData.description}</p>
                    </Col>
                    {/* check if current user is owner of recipe (ONCE UID IS IMPLEMENTED) */}
                    <Col xs={2}>
                    {currentUser && currentUser.uid == userData.uid && <div>
                        <Row>
                        <Button onClick={updateRecipe}>Update Recipe</Button>
                        <EditRecipeModal isOpen={showEditModal} data={recipeData} user={userData} closeModal={closeModal} updateModal={updateModal}></EditRecipeModal>
                        </Row>
                    </div>}
                        <Row>
                        <Rating name="rating" value={userRating} precision={1} onChange={(event, newValue) => handleRating(event, newValue)}/>
                        </Row>
                    </Col>
                    <Col xs={6} md={4}>
                        <Image src={`${url}images/${recipeData.picture}`} alt = "noimg" thumbnail="true"></Image>
                    </Col>
                </Row>
                <h3>Average Rating:</h3>
                <Rating name="rating1" value={averageRating} precision={1} readOnly/>

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
                        <Form.Control name='comment' type="text" value={comment.comment} placeholder="Add a public comment..." onChange={handleChange}/>
                        {submitted && <p className='success'>Your comment has been submitted!</p>}
                    </Form.Group>
                    {errors && <p className='error'>{errors}</p>}
                    <Button type='submit' onClick={currentUser? (e)=>handleSubmit(e): ()=>redirectToLogin()}>Comment</Button>
                </Form>
                <br></br>
                <h4>Comments:</h4>
                <hr></hr>
                <ListGroup>
                {commentData.map((comment)=>(
                    <ListGroup.Item key={comment._id} as="li">
                        <Container>
                            <Row>
                                <span className="user-comment-name">
                                    <Link to={`/users/${comment.userId}`}>{comment.userName}</Link>
                                </span>
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