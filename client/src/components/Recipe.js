import React, {useState, useEffect} from 'react';
import '../App.css';
import axios from 'axios'
import { Container, ListGroup, Row, Col, Image} from 'react-bootstrap'
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
    const url = 'https://localhost:3001/';
    const [recipeData, setRecipeData] = useState(undefined);
    useEffect(() =>{
        async function fetchData(){
            try{
                const recipe = await axios.get(`${url}recipes/608483eb3f1a062020344721`); //getRecipeById

                console.log(recipe);
                setRecipeData(recipe);
            }catch(e){
                console.log("No recipe with this id");
            }
        }
        fetchData();
    }, [props.match.params.id])
    
    //let name = recipeData.name;
    return (
        <Container>
            <Row>
                <Col>
                    <h1 id='recipeTitle'>Blueberry Muffins</h1>
                    <h2 id='chef'>Created By: John Wick</h2>
                    <br></br>
                    <p id='desc'>Description: A delicious recipe passed down from my Grandma.</p>
                </Col>
                <Col xs={6} md={4}>
                    <Image src={logo} alt = "noimg" thumbnail="true"></Image>
                </Col>
            </Row>
            
            
            
            <h3>Ingredients</h3>
            <ListGroup>
                <ListGroup.Item className='ingredient border-0'>
                    <li>List Ingredients Here</li>
                </ListGroup.Item>
                <ListGroup.Item className='ingredient border-0'>
                    <li>List Ingredients Here</li>
                </ListGroup.Item>
                <ListGroup.Item className='ingredient border-0'>
                    <li>List Ingredients Here</li>
                </ListGroup.Item>
            </ListGroup>
            <h3>Procedure:</h3>
            <ol>
                <li>List all Steps</li>
                <li>Like</li>
                <li>This</li>
            </ol>
        </Container>
    )
}
export default Recipe;