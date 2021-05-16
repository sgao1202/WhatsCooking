import { Form, Button, Col, InputGroup } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useContext } from 'react'
import { AuthContext } from '../firebase/Auth'

function NewRecipe(){
    const { currentUser } = useContext(AuthContext);
    const initialFormData = {
        title: "",
        userId: "",
        picture: "",
        description: "",
        ingredients: [{name: "", portion: "", units: ""}],
        procedure: [""]
    }
    const url = 'http://localhost:3001/';
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({
        title: false,
        description: false,
        ingredients: [false],
        procedure: [false]
    });
    const handleFileChange = (e) => {
        console.log(e.target.files[0])
        setFormData({
            ...formData, [e.target.name]: e.target.files[0]
        })
        console.log(formData)
    }
    const handleChange = (e) =>{
        setFormData({
            ...formData, [e.target.name]: e.target.value.trim()
        })
    }
    const handleSubmit = async(e) =>{
        e.preventDefault();
        // const formErrors = findFormErrors();
        // console.log(formErrors)
        // setErrors(formErrors);
        setValidated(true);
        if (validateForm()){
            try{
                //upload the image, receive the generated uid of image
                const imageData = new FormData();
                imageData.append("file", formData.picture, formData.picture.name)
                let picId = await axios.post(`${url}uploadImage`, imageData)

                //store the picture in the database as a uid
                formData.picture = picId.data;
                let newRecipe = await axios.post(`${url}recipes`, formData)
                
                //reset form data
                // setFormData(initialFormData);
                setSubmitted(true);
                
            }catch(e){
                console.log(e)
            }
        }
        
    }
    useEffect(()=>{
        async function fetchData(){
            let user = await axios.get(`${url}users/uid/${currentUser.uid}`);
            console.log(user)
            setFormData({
                ...formData, ['userId'] : user.data._id
            })
            console.log(formData)
        }
        fetchData();  
    }, [currentUser])
    const validateForm = () =>{
        return true;
    }
    const findFormErrors = () => {
        const newErrors = {ingredients: []}
        console.log("validPortionTesting")
        formData.ingredients.forEach((ingredient, index) => {
            if(ingredient.portion < 0){
                newErrors.ingredients.push(index);
            }
        })
        return newErrors;
    }


    const handleIngredientChange = (e, index) => {
        if (e.target.name !== "portion") formData.ingredients[index][e.target.name] = e.target.value.trim();
        else formData.ingredients[index][e.target.name] = parseFloat(e.target.value.trim());
        setFormData(formData);
    }
    const handleProcedureChange = (e, index) => {
        formData.procedure[index] = e.target.value.trim();
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
        // const errorsList = {...errors}
        // setErrors({
        //     ...errorsList, [ingredients]: 
        // })
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
            <Form noValidate validated={validated} encType="multipart/form-data" onSubmit={handleSubmit}>
                <Form.Row>
                    <Form.Group controlId="recipeName">
                    <Form.Label>Recipe Name:</Form.Label>
                    <Form.Control
                        required
                        type="text" 
                        name='title'
                        onChange={handleChange}
                        value={formData.title}
                    />
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
                        onChange={handleChange}
                        value={formData.description}
                    />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId='updateImage'>
                        <Form.Label>Image:</Form.Label>
                        <Form.File required type='file' name='picture' onChange={handleFileChange}></Form.File>
                    </Form.Group>
                </Form.Row>
                            
                <label>Ingredients:</label>
                {formData.ingredients.map((ingredient, index) => (
                    <Form.Row key={index}>
                    
                    <InputGroup as={Col}>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Name:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control required type="text" name="name" onChange={(e) => handleIngredientChange(e, index)}></Form.Control>
                        <Form.Control.Feedback type="invalid">Must provide an ingredient name!</Form.Control.Feedback>
                    </InputGroup>
                    <InputGroup as={Col}>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Portion:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control required type="number" name="portion" onChange={(e) => handleIngredientChange(e, index)}></Form.Control>
                        <Form.Control.Feedback type="invalid">Must provide a non-negative portion amount!</Form.Control.Feedback>
                    </InputGroup>
                    <InputGroup as={Col}>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Units:</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control required type="text" name="units" onChange={(e) => handleIngredientChange(e, index)}></Form.Control>
                        <Form.Control.Feedback type="invalid">Must provide a unit of measurement!</Form.Control.Feedback>
                    </InputGroup>
                    <Button variant="danger" as={Col} xs={1} onClick={(e) => deleteIngredient(index)}>X</Button>
                </Form.Row>
                ))}
                
                <br></br>
                <Button type="button" onClick={() => addIngredient()}>Add Ingredient+</Button>
                <br></br>
                <label>Procedure:</label>
                {formData.procedure.map((step, index)=>(
                    <Form.Row key={index}>

                        <InputGroup as={Col}>
                            <InputGroup.Prepend>
                                <InputGroup.Text>{index+1}.</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control required as="textarea" onChange={(e) => handleProcedureChange(e, index)}></Form.Control>
                            <Form.Control.Feedback type="invalid">Step cannot be empty!</Form.Control.Feedback>
                        </InputGroup>
                        <Button className='del-btn' variant="danger" as={Col} xs={1} onClick={() => deleteStep(index)}>X</Button>
                    </Form.Row>
                    
                ))}
                <br></br>
                <Button onClick={() => addStep()}>Add Step+</Button>
                <br></br>
                <br></br>
                <Button type="submit" onClick={handleSubmit}>Submit</Button>
                {submitted && <p className='success'>Your recipe has been submitted!</p>}
            </Form>
        </div>
    )
}

export default NewRecipe;