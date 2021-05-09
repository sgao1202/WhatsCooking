import { Form, Button, Col, InputGroup } from 'react-bootstrap';
import React, { useState } from 'react';
import axios from 'axios';


function NewRecipe(){
    const initialFormData = {
        title: "",
        userId: "609705b47f772731c31ed661",
        picture: "noimg.jpg",
        description: "",
        ingredients: [{name: "", portion: 0, units: ""}],
        procedure: [""]
    }
    const url = 'http://localhost:3001/';
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    
    const handleChange = (e) =>{
        setFormData({
            ...formData, [e.target.name]: e.target.value.trim()
        })
    }
    const handleSubmit = async(e) =>{
        e.preventDefault();
        const form = e.target;
        if (form.checkValidity() === false){
            e.preventDefault();
            e.stopPropagation();
        }
        setValidated(true);
        try{
            await axios.post(`${url}recipes`, formData)
        }catch(e){
            console.log(e)
        }

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
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Row>
                    <Form.Group controlId="recipeName">
                    <Form.Label>Recipe Name:</Form.Label>
                    <Form.Control
                        required
                        type="text" 
                        name='title'
                        onChange={handleChange}
                    />
                    </Form.Group>
                    </Form.Row>
                <Form.Row>
                    <Form.Group controlId="description">
                    <Form.Label>Description:</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        name="description"
                        as='textarea'
                        onChange={handleChange}
                    />
                    </Form.Group>
                </Form.Row>
                <label>Ingredients:</label>
                {formData.ingredients.map((ingredient, index) => (
                    <Form.Row key={index}>
                    {/* <Form.Label>Ingredients:</Form.Label> */}
                    
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
                        <Form.Control required type="number" name="portion" isValid={console.log(formData.ingredients[index].portion > 0)} onChange={(e) => handleIngredientChange(e, index)}></Form.Control>
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
                        {/* <Form.Label>Procedure:</Form.Label> */}
                        <InputGroup as={Col}>
                            <InputGroup.Prepend>
                                <InputGroup.Text>{index+1}.</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control required as="textarea" onChange={(e) => handleProcedureChange(e, index)}></Form.Control>
                            <Form.Control.Feedback type="invalid">Step cannot be empty!</Form.Control.Feedback>
                        </InputGroup>
                        <Button variant="danger" as={Col} xs={1} onClick={() => deleteStep(index)}>X</Button>
                    </Form.Row>
                    
                ))}
                <br></br>
                <Button onClick={() => addStep()}>Add Step+</Button>
                <br></br>
                <br></br>
                <Button type="submit">Submit</Button>
            </Form>
        </div>
    )
}

export default NewRecipe;