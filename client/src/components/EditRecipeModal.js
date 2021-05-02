import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Image, Button, Form, Modal } from 'react-bootstrap'
function EditRecipeModal(props) {
    console.log("reloaded component")
    const url = 'http://localhost:3001/';
    const [modalData, setModalData] = useState();
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(props.isOpen);
    useEffect(()=>{
        console.log("useEffect fired")
        setModalData(props.data);
        setShowEditModal(props.isOpen);
        setLoading(false);
    },[props.data, props.isOpen])
    const initialFormData = Object.freeze({
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
        formData.ingredients[index][e.target.name] = e.target.value.trim();
        setFormData(formData);
    }
    const handleModalProcedureChange = (e, index) => {
        formData.procedure[index] = e.target.value.trim();
        setFormData(formData);
    }
    const handleModalSubmit = async(e) =>{
        e.preventDefault();
        console.log(formData)
        try{
            let updatedRecipe = await axios.put(`${url}recipes/${modalData._id}`, formData);
            setModalData(updatedRecipe.data);
           
            /*FIX LATER*/
            setShowEditModal(false);
            window.location.reload();
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
        modalData.ingredients.push(emptyIngredient);
        console.log(modalData);
        props.updateModal(modalData);
        setModalData(modalData);
        
    }
    const deleteIngredient = (index) => {
        modalData.ingredients.splice(index,1);
        setModalData(modalData);
    }
    const addStep = () => {
        modalData.procedure = modalData.procedure.push("")
        setModalData(modalData);
    }
    const deleteStep = (index) => {
        modalData.procedure.splice(index,1);
        setModalData(modalData);
    }
    return(!loading &&
        <Modal show={showEditModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
            <Modal.Title>Update {modalData.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={(e) => handleModalSubmit(e)}>
                    <Form.Group controlId="updateTitle">
                        <Form.Label className='modal-subtitle'>Name:</Form.Label>
                        <Form.Control type="text" name='title' defaultValue={modalData.title} onChange={handleModalChange}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="displayChef">
                        <Form.Label className='modal-subtitle'>Chef:</Form.Label>
                        <Form.Control plaintext readOnly defaultValue={props.user.firstName + " " + props.user.lastName}/>
                    </Form.Group>
                    <Form.Group controlId="updateDesc">
                        <Form.Label className='modal-subtitle'>Description:</Form.Label>
                        <Form.Control type="text" name='description' defaultValue={modalData.description} onChange={handleModalChange}></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="updateIngredients">
                        <Form.Label className='modal-subtitle'>Ingredients:</Form.Label>
                        {modalData.ingredients.map((ingredient, index)=>(
                            <Form.Row key={index}>
                                <Col>
                                    <Form.Control type="text" name="name" defaultValue={ingredient.name} onChange={(e) => handleModalIngredientChange(e, index)}></Form.Control>
                                </Col>
                                <Col>
                                    <Form.Control type="number" name="portion" defaultValue={ingredient.portion} onChange={(e) => handleModalIngredientChange(e,index)}></Form.Control>
                                </Col>
                                <Col>
                                    <Form.Control type="text" name="units" defaultValue={ingredient.units} onChange={(e) => handleModalIngredientChange(e,index)}></Form.Control>
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
                        {modalData.procedure.map((step, index)=>(
                            // <Form.Control type="text" defaultValue={step}></Form.Control>
                            <Form.Row>
                                <Col>
                                    <textarea key={index} rows="4" cols="50" defaultValue={step} onChange={(e)=>handleModalProcedureChange(e, index)}></textarea>
                                </Col>
                                <Col xs={2}>
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