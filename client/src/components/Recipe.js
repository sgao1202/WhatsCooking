import React, {useState, useEffect, useContext} from 'react';
import { AuthContext } from '../firebase/Auth';
import { Link, Redirect } from 'react-router-dom'
import '../App.css';
import axios from 'axios'
import { Container, Row, Col, Image, Button, Form, ListGroup } from 'react-bootstrap'
import { BsFillBookmarkFill, BsBookmark} from 'react-icons/bs'
import { FaEdit } from 'react-icons/fa'
import { Rating } from "@material-ui/lab";
import EditRecipeModal from './EditRecipeModal';
import Error from './Error';

const Recipe = (props) =>{

    const { baseUrl, currentUser } = useContext(AuthContext);
    const url = baseUrl;
    const [loading, setLoading] = useState(true);
    const [recipeData, setRecipeData] = useState();
    const [userData, setUserData] = useState();
    const [commentData, setCommentData] = useState();
    const [errors, setErrors] = useState();
    const [redirect, setRedirect] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [userRatingId, setUserRatingId] = useState(undefined);
    const [averageRating, setAverageRating] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);
    const [hasError, setHasError] = useState(false);

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
        setTotalRatings(data.length);
    }
    
    useEffect(() =>{
        async function fetchData(){
            try{
                let d = null;
                try{
                let { data } = await axios.get(`${url}recipes/${props.match.params.id}`); //getRecipeById
                d = data;
                } catch(e) {
                    setHasError(true);
                    setLoading(false);
                    return;
                }
                let data = d;
                setRecipeData(data);
                //get user data associated with recipe
                let user = await axios.get(`${url}users/${data.userId}`);
                setUserData(user.data);
                //get all comments associated with recipe
                let comments = await axios.get(`${url}comments/recipe/${props.match.params.id}`);
                if(currentUser) {
                    //check if user has this page bookmarked
                    let cUser = await axios.get(`${url}users/uid/${currentUser.uid}`);
                    cUser.data.bookmarks.includes(data._id)? setBookmarked(true) : setBookmarked(false);
                }

                //get all user names for each comment
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
                setLoading(false);
                return <Error/>;
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
    }, [props.match.params.id, userRating]);

    // useEffect(() =>{
    //     getAverageRating();
    // }, [userRating]);

    if (redirect){
        return <Redirect to='/login'></Redirect>
    }
    if (loading){
        return(
            <h1>Loading...</h1>
        )
    } else if(hasError) {
        return <Error/>
    }
    else{
        let ingredients = recipeData.ingredients.map((ingredient, index) => {
            return (
                <ListGroup.Item className="no-bt border-bottom" key={index}>
                    <Row>
                        <Col>
                            <span className="font-weight-bold">{ingredient.name}</span>
                        </Col>
                        <Col>
                            <span className="font-italic">{ingredient.portion} {ingredient.units}</span>
                        </Col>
                    </Row>
                </ListGroup.Item>
            );
        });

        let procedure = recipeData.procedure.map((step, index)=>(
            <ListGroup.Item key={index} className="pb-5 no-bt shadow-sm mb-3 border-50">
                    <span className="custom-ol-item custom-ol-item-span">{index + 1}.</span>
                    <p className="custom-ol-item-p">{step}</p>
            </ListGroup.Item>
            
        ));

        return (
            <Container>
                <Row className="shadow border-50 p-4 mb-5">
                    <Col>
                        <span>
                            <h1 id='recipe-title'>{recipeData.title}
                            {!bookmarked || !currentUser ?<BsBookmark onClick={currentUser? (e)=>toggleBookmarks(e): ()=>redirectToLogin()}></BsBookmark> : <BsFillBookmarkFill className='bookmarkfilled' onClick={currentUser? (e)=>toggleBookmarks(e): ()=>redirectToLogin()}></BsFillBookmarkFill>}</h1>
                        </span>
                        <h2 id='recipe-chef' className="h6">
                            Posted By: 
                            <Link to={`/users/${userData.uid}`}> {userData.firstName} {userData.lastName}</Link>
                        </h2>
                        <div>
                            <Row>
                                <Col>
                                    <Rating name="rating1" value={averageRating} precision={1} readOnly/>
                                    <span className="stats">({totalRatings})</span>
                                </Col>
                            </Row>
                        </div>
                        <p id='recipe-desc'>{recipeData.description}</p>
                    </Col>
                    {/* check if current user is owner of recipe */}
                    <Col xs={2}>
                        { currentUser && currentUser.uid === userData.uid && 
                            <div className="mb-3">
                                <Row>
                                    <Button onClick={updateRecipe}><FaEdit className="mb-1 mr-2"/>Update Recipe</Button>
                                    <EditRecipeModal isOpen={showEditModal} data={{...recipeData}} user={userData} closeModal={closeModal} updateModal={updateModal}></EditRecipeModal>
                                </Row>
                            </div>}
                        {currentUser && 
                            <Row>
                                <h5>Rate This Recipe:</h5>
                                <Rating name="rating" value={userRating} precision={1} onChange={(event, newValue) => handleRating(event, newValue)}/>
                            </Row>
                        }
                    </Col>
                    <Col xs={6} md={4}>
                        <Image src={`${url}images/${recipeData.picture}`} alt="noimg" thumbnail="true"></Image>
                    </Col>
                </Row>
                <Row className="mb-3 p-4">
                    <Container className="border-bottom mb-3">
                        <h3>Ingredients</h3>
                    </Container>
                    <Container>
                        <Row>
                            <Col>
                                <h5>Ingredient Name</h5>
                            </Col>
                            <Col>
                                <h5>Measurements</h5>
                            </Col>
                        </Row>
                        <ListGroup>
                            {ingredients}
                        </ListGroup>
                    </Container>    
                </Row>
                <Row className="mb-3 p-4 border-bottom">
                    <Container className="border-bottom mb-3">
                        <h3>Procedures</h3>
                    </Container>
                    <Container>
                        <ListGroup>
                            {procedure}
                        </ListGroup>
                    </Container>
                </Row>
                <Form className="mb-3">
                    <Form.Group controlId="addComment" onSubmit={handleSubmit}>
                        <Form.Label></Form.Label>
                        <Form.Control name='comment' type="text" value={comment.comment} placeholder="Add a public comment..." onChange={handleChange}/>
                        {submitted && <p className='success'>Your comment has been submitted!</p>}
                    </Form.Group>
                    {errors && <p className='error'>{errors}</p>}
                    <Button type='submit' onClick={currentUser? (e)=>handleSubmit(e): ()=>redirectToLogin()}>Comment</Button>
                </Form>
                <Row>
                    <Container>
                        <h3>Comments</h3>
                    </Container>
                    <Container>
                        <ListGroup variant="flush">
                            {commentData.map((comment)=>(
                                <ListGroup.Item key={comment._id} as="li">
                                    <Container>
                                        <Row>
                                            <span className="user-comment-name">
                                                {comment.userName}
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
                </Row>
            </Container>
        )
    }
    
}
export default Recipe;