import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Image, Button, Form, Modal } from 'react-bootstrap'
function EditRecipeModal(props) {
    const url = 'http://localhost:3001/';
    // const [modalData, setModalData] = useState();
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(props.isOpen);
    const [validated, setValidated] = useState(false);
    useEffect(()=>{
        // setModalData(props.data);
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
        setShowEditModal(false);
        props.closeModal();
    }
    const handleModalChange = (e) =>{
        setFormData({
            ...formData, [e.target.name]: e.target.value.trim()
        })
    }
    const handleModalIngredientChange = (e, index) => {
        console.log(formData.ingredients[index])
        if (e.target.name !== "portion") formData.ingredients[index][e.target.name] = e.target.value.trim();
        else formData.ingredients[index][e.target.name] = parseFloat(e.target.value.trim());
        console.log(formData)
        setFormData(formData);
    }
    const handleModalProcedureChange = (e, index) => {
        formData.procedure[index] = e.target.value.trim();
        setFormData(formData);
    }
    const handleModalSubmit = async(e) =>{
        e.preventDefault();
        const form = e.target;
        if (form.checkValidity() === false){
            e.preventDefault();
            e.stopPropagation();
        }
        setValidated(true);
        try{
            let updatedRecipe = await axios.put(`${url}recipes/${formData.recipeid}`, formData);
            setFormData(updatedRecipe.data);
            props.updateModal(formData);
           
            /*FIX LATER*/
            handleCloseModal();
        }catch(e){
            console.log(e);
        }
        setShowEditModal(false);
        return;
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
            <Modal.Title>Update {formData.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={validated} onSubmit={(e) => handleModalSubmit(e)}>
                    <Form.Group controlId="updateTitle">
                        <Form.Label className='modal-subtitle'>Name:</Form.Label>
                        <Form.Control required type="text" name='title' defaultValue={formData.title} onChange={handleModalChange}></Form.Control>
                        <Form.Control.Feedback type="invalid">Recipe name cannot be empty!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="displayChef">
                        <Form.Label className='modal-subtitle'>Chef:</Form.Label>
                        <Form.Control plaintext readOnly defaultValue={props.user.firstName + " " + props.user.lastName}/>
                    </Form.Group>
                    <Form.Group controlId="updateDesc">
                        <Form.Label className='modal-subtitle'>Description:</Form.Label>
                        <Form.Control required type="text" name='description' defaultValue={formData.description} onChange={handleModalChange}></Form.Control>
                        <Form.Control.Feedback type="invalid">Description cannot be empty!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="updateIngredients">
                        <Form.Label className='modal-subtitle'>Ingredients:</Form.Label>
                        {formData.ingredients.map((ingredient, index)=>(
                            <Form.Row key={index}>
                                <Col>
                                    <Form.Control required type="text" name="name" defaultValue={ingredient.name} onChange={(e) => handleModalIngredientChange(e, index)}></Form.Control>
                                    <Form.Control.Feedback type="invalid">Must provide an ingredient name!</Form.Control.Feedback>
                                </Col>
                                <Col>
                                    <Form.Control required type="number" name="portion" defaultValue={ingredient.portion} onChange={(e) => handleModalIngredientChange(e,index)}></Form.Control>
                                    <Form.Control.Feedback type="invalid">Must provide a non-negative portion amount!</Form.Control.Feedback>
                                </Col>
                                <Col>
                                    <Form.Control required type="text" name="units" defaultValue={ingredient.units} onChange={(e) => handleModalIngredientChange(e,index)}></Form.Control>
                                    <Form.Control.Feedback type="invalid">Must provide a unit of measurement!</Form.Control.Feedback>
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
                            // <Form.Control type="text" defaultValue={step}></Form.Control>
                            <Form.Row key={index}>
                                <Col>
                                    <Form.Control required as='textarea' defaultValue={step} rows={4} onChange={(e)=>handleModalProcedureChange(e, index)}></Form.Control>
                                    <Form.Control.Feedback type="invalid">Step cannot be empty!</Form.Control.Feedback>
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