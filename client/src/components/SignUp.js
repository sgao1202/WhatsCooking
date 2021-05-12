import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { AuthContext } from '../firebase/Auth';
import { doCreateUserWithEmailAndPassword, doSignInWithEmailAndPassword } from '../firebase/FirebaseFunctions';
import axios from 'axios';
import utils from '../lib/Utility';

const SignUp = () => {
    const { currentUser, mongoUser, url } = useContext(AuthContext);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        document.title = "Sign Up";
    }, []);

    // Will post multiple times, not a good solution
    // useEffect(() => {
    //     // Create the user in our database
    //     async function postUser() {
    //         try {
    //             const { data } = await axios.post(`${url}/users`, {
    //                 uid: currentUser.uid,
    //                 firstName: firstName,
    //                 lastName: lastName,
    //             });
    //             console.log(data);
    //             setUser(data);
    //         } catch (e) {
    //             console.log(e);
    //             alert(e);
    //         }
    //     }
    //     if (currentUser) postUser();
    // }, [currentUser])

    const postUser = async () => {
        try {
            const { data } = await axios.post(`${url}/users`, {
                uid: currentUser.uid,
                firstName: firstName,
                lastName: lastName,
            });
            console.log(data);
        } catch (e) {
            console.log(e);
            alert(e);
        }
    };
    
    // Custom validation for fields
    const validateForm = (form) => {
        if (!utils.validString(firstName) || !utils.validString(lastName) || !utils.validString(email) || !utils.validString(password)) return false;
        // Make sure that an email contains the @ symbol
        if (!email.includes('@')) return false;
        return true;
    };

    const handleSignUp = async (event) => {
        event.preventDefault();
        setValidated(true);
        setLoading(true);
        if (validateForm()) {
            try {
                await doCreateUserWithEmailAndPassword(email, password, `${firstName} ${lastName}`);
                await postUser();
            } catch(e) {
                alert(e);
            }
        }
        setLoading(false);
    };

    const validForm = () => {return email.length > 0 && password.length > 0 && firstName.length > 0 && lastName.length > 0;};

    if (currentUser && mongoUser) return <Redirect to='/home'></Redirect>
    return (
        <div className="Login">
            <Form noValidate validated={validated} onSubmit={handleSignUp}>
                <Form.Group size="lg" controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        required
                        autoFocus
                        type="text"
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter a valid first name.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group size="lg" controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter a valid last name.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group size="lg" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        required
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter a valid email.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter a valid first name.
                    </Form.Control.Feedback>
                </Form.Group>
                <Button block size="lg" variant="primary" type="submit" disabled={!validForm()}>
                    {loading ? 'Loading...' : 'Sign Up'}
                </Button>
            </Form>
        </div>
    );
};

export default SignUp;