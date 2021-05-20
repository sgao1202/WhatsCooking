import { Form, Button, Col, InputGroup } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react'
import { AuthContext } from '../firebase/Auth'
import utils from '../lib/Utility';
import { FaBullseye } from 'react-icons/fa';
const { v4: uuidv4 } = require('uuid');

function NewRecipe(props){
    const { baseUrl, currentUser } = useContext(AuthContext);
    const initialFormData = {
        title: "",
        userId: "",
        picture: "",
        description: "",
        ingredients: [{name: "", portion: "", units: ""}],
        procedure: [""]
    }
    const url = baseUrl.substring(0, baseUrl.lastIndexOf("/"));
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({
        title: false,
        description: false,
        ingredients: false,
        procedure: false
    });
    const [submitted, setSubmitted] = useState(false);

    useEffect(()=>{
        async function fetchData(){
            let user = await axios.get(`${url}/users/uid/${currentUser.uid}`);
            setFormData({
                ...formData, userId : user.data._id
            })
        }
        fetchData();  
        
    }, [currentUser])

    const handleFileChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.files[0]
        })
    }
    const handleChange = (e) =>{
        setFormData({
            ...formData, [e.target.name]: e.target.value.trim()
        })
    }
    const handleSubmit = async(e) =>{
        e.preventDefault();
        setSubmitted(true);
        if (validateForm()){
            try{
                //upload the image, receive the generated uid of image
                const imageData = new FormData();
                console.log(formData.picture)
                imageData.append("file", formData.picture)
                let picId = await axios.post(`${url}/uploadImage`, imageData)

                //store the picture in the database as a uid
                formData.picture = picId.data;
                let newRecipe = await axios.post(`${url}/recipes`, formData)
                
                // redirect to new page after recipe created
                props.history.push(`/recipe/${newRecipe.data._id}`)
                
            }catch(e){
                console.log(e)
            }
        }
        else{
            console.log("form has failed to submit");
        }
    }
    

    const validateForm = () =>{
        const newErrors = {
            title: !utils.validString(formData.title),
            description: !utils.validString(formData.description),
            picture: !formData.picture,
            ingredientNames: checkIngredientNames(),
            ingredientPortions: checkIngredientPortions(),
            ingredientUnits: checkIngredientUnits(),
            procedure: checkProcedureErrors()
        }

        console.log(newErrors);
        setErrors(newErrors);
        function checkIngredientNames(){
            let ingredients = formData.ingredients
            for (let i = 0; i<ingredients.length; i++){
                if(!utils.validString(ingredients[i].name)){
                    return true;
                }
            }
            return false;
        }
        function checkIngredientPortions(){
            let ingredients = formData.ingredients
            console.log(ingredients)
            for (let i = 0; i<ingredients.length; i++){
                if(!ingredients[i].portion || ingredients[i].portion < 0){
                    return true;
                }
            }
            return false;
        }
        function checkIngredientUnits(){
            let ingredients = formData.ingredients
            for (let i = 0; i<ingredients.length; i++){
                if(!utils.validString(ingredients[i].units)){
                    return true;
                }
            }
            return false;
        }

        function checkProcedureErrors(){
            let procedure = formData.procedure;
            for (let i = 0; i<procedure.length; i++){
                if(!utils.validString(procedure[i])){
                    return true;
                }
            }
            return false;
        }
        if (newErrors.title || newErrors.description || newErrors.picture || newErrors.ingredientNames || newErrors.ingredientPortions || newErrors.ingredientUnits || newErrors.procedure) return false;
        return true;
    }


    const handleIngredientChange = (e, index) => {
        if (e.target.name !== "portion") formData.ingredients[index][e.target.name] = e.target.value.trim();
        else formData.ingredients[index][e.target.name] = parseFloat(e.target.value.trim());
        setFormData(formData);
    }
    const handleProcedureChange = (e, index) => {
        formData.procedure[index] = e.target.value.trim();
        console.log( e.target.value.trim())
        setFormData(formData);
    }

    const addIngredient = () => {
        let emptyIngredient = {
            name: "",
            portion: "",
            units: ""
        }
        const fields = {...formData};
        fields.ingredients.push(emptyIngredient);
        setFormData(fields)
    }

    const deleteIngredient = (index) => {
        const fields = {...formData};
        fields.ingredients.splice(index,1);
        setFormData(fields);
    }

    const addStep = () => {
        const fields = {...formData};
        fields.procedure.push("");
        setFormData(fields)
    }

    const deleteStep = (index) => {
        const fields = {...formData};
        fields.procedure.splice(index,1);
        setFormData(fields);
    }
    return (
        <div>
            <h1>Create a Recipe</h1>
            <Form noValidate encType="multipart/form-data" onSubmit={handleSubmit}>
                <Form.Row>
                    <Form.Group controlId="recipeName">
                    <Form.Label>Recipe Name:</Form.Label>
                    <Form.Control
                        required
                        type="text" 
                        name='title'
                        onChange={(e) => {handleChange(e) 
                                        setErrors({...errors, title: false})}}
                        isValid={!!errors.title}
                        isInvalid={errors.title}
                    />
                    <Form.Control.Feedback type="invalid">Must provide a title!</Form.Control.Feedback>
                    </Form.Group>
                    </Form.Row>
                <Form.Row>
                    <Form.Group size='lg' controlId="description">
                    <Form.Label>Description:</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        name="description"
                        as='textarea'
                        rows='5'
                        onChange={(e) => {handleChange(e) 
                            setErrors({...errors, description: false})}}
                        isValid={!!errors.description}
                        isInvalid={errors.description}
                    />
                    <Form.Control.Feedback type="invalid">Must provide a description!</Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId='updateImage'>
                        <Form.Label>Image:</Form.Label>
                        
                        <Form.File 
                            type='file' 
                            name='picture' 
                            accept="image/*" 
                            onChange={(e) => {handleFileChange(e)
                                setErrors({...errors, picture : false})
                            }}></Form.File>
                        {errors.picture && submitted && <p className='error'>Must provide an image!</p>}
                    </Form.Group>
                </Form.Row>
                            
                <label>Ingredients:</label>
                {formData.ingredients.map((ingredient, index) => (
                    <Form.Row key={String(uuidv4())}>
                    
                    <InputGroup as={Col}>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Name:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control required 
                                type="text" 
                                name="name" 
                                onBlur={(e) => {handleIngredientChange(e, index)
                                                setErrors({...errors, ingredientNames : false})}} 
                                isValid={!!errors.ingredientNames} 
                                isInvalid={errors.ingredientNames} defaultValue={formData.ingredients[index]["name"]}></Form.Control>
                        <Form.Control.Feedback type="invalid">Must provide an ingredient name for all ingredients!</Form.Control.Feedback>
                    </InputGroup>
                    <InputGroup as={Col}>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Portion:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control required 
                            type="number" 
                            name="portion" 
                            onBlur={(e) => {handleIngredientChange(e, index)
                                setErrors({...errors, ingredientPortions : false})}} 
                            isValid={!!errors.ingredientPortions} 
                            isInvalid={errors.ingredientPortions} defaultValue={formData.ingredients[index]["portion"]}></Form.Control>
                        <Form.Control.Feedback type="invalid">Must provide a non-negative portion amount for all ingredients!</Form.Control.Feedback>
                    </InputGroup>
                    <InputGroup as={Col}>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Units:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control required 
                        type="text" 
                        name="units" 
                        onBlur={(e) => {handleIngredientChange(e, index)
                            setErrors({...errors, ingredientUnits : false})}} 
                        isValid={!!errors.ingredientUnits} 
                        isInvalid={errors.ingredientUnits} defaultValue={formData.ingredients[index]["units"]}></Form.Control>
                        <Form.Control.Feedback type="invalid">Must provide a unit of measurement for all ingredients!</Form.Control.Feedback>
                    </InputGroup>
                    <Button variant="danger" as={Col} xs={1} onClick={(e) => deleteIngredient(index)}>X</Button>
                </Form.Row>
                ))}
                
                <br></br>
                <Button type="button" onClick={() => addIngredient()}>Add Ingredient+</Button>
                <br></br>
                <label>Procedure:</label>
                {formData.procedure.map((step, index)=>(
                    <Form.Row key={String(uuidv4())}>
                        <InputGroup as={Col}>
                            <InputGroup.Prepend>
                                <InputGroup.Text>{index+1}.</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control required 
                                as="textarea" 
                                onBlur={(e) => {handleProcedureChange(e, index)
                                    setErrors({...errors, procedure : false})}} 
                                isInvalid={errors.procedure} defaultValue={formData.procedure[index]}>
                                    
                                </Form.Control>
                            <Form.Control.Feedback type="invalid">Step cannot be empty for all steps!</Form.Control.Feedback>
                        </InputGroup>
                        <Button className='del-btn' variant="danger" as={Col} xs={1} onClick={() => deleteStep(index)}>X</Button>
                    </Form.Row>
                    
                ))}
                <br></br>
                <Button onClick={() => addStep()}>Add Step+</Button>
                <br></br>
                <br></br>
                <Button type="submit" onClick={handleSubmit}>Submit</Button>
            </Form>
        </div>
    )
}

export default withRouter(NewRecipe);