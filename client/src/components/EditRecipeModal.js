import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Image, Button, Form, Modal } from 'react-bootstrap'
import utils from '../lib/Utility';
function EditRecipeModal(props) {
    const url = 'http://localhost:3001/';
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(props.isOpen);
    const [errors, setErrors] = useState(false);
    const [newImage, setNewImage] = useState(false);
    const [{src, alt}, setImage] = useState({
        src: props.data.picture,
        alt: "Upload an image"
    })
    useEffect(()=>{
        setShowEditModal(props.isOpen);
        setLoading(false);
    },[props.data, props.isOpen])


    const initialFormData = Object.freeze({
        recipeid: props.data._id,
        title: props.data.title,
        userId: props.user._id,
        picture: props.data.picture,
        description: props.data.description,
        ingredients: props.data.ingredients,
        procedure: props.data.procedure
    })
    
    const [formData, setFormData] = useState(initialFormData);
    const handleCloseModal = () =>{
        //reset form data when closed
        setFormData(initialFormData);
        setShowEditModal(false);
        props.closeModal();
    }
    const handleModalChange = (e) =>{
        setFormData({
            ...formData, [e.target.name]: e.target.value.trim()
        })
    }
    const handleModalIngredientChange = (e, index) => {
        // console.log(formData.ingredients[index])
        if (e.target.name !== "portion") formData.ingredients[index][e.target.name] = e.target.value.trim();
        else formData.ingredients[index][e.target.name] = parseFloat(e.target.value.trim());
        setFormData(formData);
    }
    const handleModalProcedureChange = (e, index) => {
        formData.procedure[index] = e.target.value.trim();
        setFormData(formData);
    }
    const handleFileChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.files[0]
        })
        console.log(formData)
        setImage(true);
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

    const handleModalSubmit = async(e) =>{
        e.preventDefault();
        if (validateForm()){
            try{
                if(newImage){
                    const imageData = new FormData();
                    imageData.append("file", formData.picture);
                    let picId = await axios.post(`${url}uploadImage`, imageData)
                    console.log(picId)
                    //store the picture in the database as a uid
                    formData.picture = picId.data;
                }
                console.log(formData)
                let updatedRecipe = await axios.put(`${url}recipes/${formData.recipeid}`, formData);
                setFormData(updatedRecipe.data);
                props.updateModal(formData);
            
                handleCloseModal();
            }catch(e){
                console.log(e);
            }
            setShowEditModal(false);
        }else{
            console.log("Modal failed to submit")
        } 
    }
    const addIngredient = () => {
        let emptyIngredient = {
            name: "",
            portion: "",
            units: ""
        }
        const fields = {...formData};
        fields.ingredients.push(emptyIngredient);
        setFormData(fields);
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


    return(!loading &&
        <Modal show={showEditModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
            <Modal.Title>Update {initialFormData.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate enctype="multipart/form-data" onSubmit={(e) => handleModalSubmit(e)}>
                    <Form.Group controlId='image'>
                        <Form.Label className='modal-subtitle'>Current Image:</Form.Label>
                        <Form.Control className='modal-image' type='image' src={`${url}images/${initialFormData.picture}`} alt='noimg'></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='updateImage'>
                        <Form.File type='file' name='picture' onChange={handleFileChange}></Form.File>
                    </Form.Group>
                    <Form.Group controlId="updateTitle">
                        <Form.Label className='modal-subtitle'>Name:</Form.Label>
                        <Form.Control required 
                        type="text" 
                        name='title' 
                        defaultValue={formData.title} 
                        onChange={handleModalChange} 
                        isInvalid={errors.title}></Form.Control>
                        <Form.Control.Feedback type="invalid">Recipe name cannot be empty!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="displayChef">
                        <Form.Label className='modal-subtitle'>Chef:</Form.Label>
                        <Form.Control plaintext readOnly defaultValue={props.user.firstName + " " + props.user.lastName}/>
                    </Form.Group>
                    <Form.Group controlId="updateDesc">
                        <Form.Label className='modal-subtitle'>Description:</Form.Label>
                        <Form.Control required 
                        type="text" 
                        name='description' 
                        defaultValue={formData.description} 
                        onChange={(e) => {handleModalChange(e) 
                            setErrors({...errors, description: false})}}
                        isInvalid={errors.description}></Form.Control>
                        <Form.Control.Feedback type="invalid">Description cannot be empty!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="updateIngredients">
                        <Form.Label className='modal-subtitle'>Ingredients:</Form.Label>
                        {formData.ingredients.map((ingredient, index)=>(
                            <Form.Row key={index}>
                                <Col>
                                    <Form.Control required 
                                    type="text" 
                                    name="name" 
                                    defaultValue={ingredient.name} 
                                    onChange={(e) => {handleModalIngredientChange(e, index)
                                        setErrors({...errors, ingredientNames : false})}} 
                                    isInvalid={errors.ingredientNames}></Form.Control>
                                    <Form.Control.Feedback type="invalid">Must provide an ingredient name for all ingredients!</Form.Control.Feedback>
                                </Col>
                                <Col>
                                    <Form.Control required 
                                    type="number" 
                                    name="portion" 
                                    defaultValue={ingredient.portion} 
                                    onChange={(e) => {handleModalIngredientChange(e, index)
                                        setErrors({...errors, ingredientPortions : false})}} 
                                    isInvalid={errors.ingredientPortions}></Form.Control>
                                    <Form.Control.Feedback type="invalid">Must provide a non-negative portion amount for all ingredients!</Form.Control.Feedback>
                                </Col>
                                <Col>
                                    <Form.Control required 
                                    type="text" 
                                    name="units" 
                                    defaultValue={ingredient.units} 
                                    onChange={(e) => {handleModalIngredientChange(e, index)
                                        setErrors({...errors, ingredientUnits : false})}} 
                                    isInvalid={errors.ingredientUnits}></Form.Control>
                                    <Form.Control.Feedback type="invalid">Must provide a unit of measurement for all ingredients!</Form.Control.Feedback>
                                </Col>
                                <Col xs={1}>
                                    <Button className='ingredient-del-btn' variant="danger" onClick={()=> deleteIngredient(index)}>X</Button>
                                </Col>
                            </Form.Row>
                        ))}
                        <Button onClick={addIngredient}>Add +</Button>
                    </Form.Group>
                    <Form.Group controlId="updateProcedure">
                        <Form.Label className='modal-subtitle'>Procedure:</Form.Label>
                        <br></br>
                        {formData.procedure.map((step, index)=>(
                            <Form.Row key={index}>
                                <Col>
                                    <Form.Control 
                                    required 
                                    as='textarea' 
                                    defaultValue={step} 
                                    rows={4} 
                                    onChange={(e)=>handleModalProcedureChange(e, index)} 
                                    isInvalid={errors.procedure}></Form.Control>
                                    <Form.Control.Feedback type="invalid">All steps cannot be empty!</Form.Control.Feedback>
                                </Col>
                                <Col xs={1}>
                                    <Button variant="danger" onClick={()=> deleteStep(index)}>X</Button>
                                </Col>
                            </Form.Row>
                        ))}
                        <br></br>
                        <Button onClick={addStep}>Add +</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
                Close
            </Button>
            <Button variant="primary" type='submit' onClick={handleModalSubmit}>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditRecipeModal;