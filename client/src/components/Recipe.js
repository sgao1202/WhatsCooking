import React, {useState, useEffect} from 'react';
import '../App.css';

const Recipe = (props) =>{
    /* Contents to be included:
    Name
    Author Name
    Image
    Description
    Ingredients
    Procedure
    */
    const [recipeData, setRecipeData] = useState(undefined);
    useEffect(() =>{
        async function fetchData(){
            try{
                const recipe = undefined; //getRecipeById
                setRecipeData(recipe);
            }catch(e){
                console.log("No recipe with this id");
            }
        }
        fetchData();
    }, [props.match.params.id])
    
    return (
        <div>
            <h1>Recipe Name</h1>
            <h2>Created By: Author Name</h2>
            
            <p>Description: A delicious recipe passed down from my Grandma.</p>
            <h3>Ingredients</h3>
            <ul>
                <li>List Ingredients Here</li>
            </ul>
            <h3>Procedure:</h3>
            <ol>
                <li>List all Steps</li>
            </ol>
        </div>
    )
}
export default Recipe;