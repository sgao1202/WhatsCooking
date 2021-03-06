import React, { useState, useEffect, useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { AuthContext } from '../firebase/Auth';
import { doSignInWithEmailAndPassword } from '../firebase/FirebaseFunctions';
import utils from '../lib/Utility';

const Login = () => {
    const { currentUser } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userNotFound, setUserNotFound] = useState(false);
    const [tooManyRequests, setTooManyRequests] = useState(false);
    const [errors, setErrors] = useState({});
    const errorCodes = {
        userNotFound: 'auth/user-not-found',
        wrongPassword: 'auth/wrong-password',
        tooManyRequests: 'auth/too-many-requests'
    };

    useEffect(() => {
        document.title = "Login";
    }, []);

    useEffect(() => {
        // Side effect to reset email and password input fields
        if (userNotFound) {
            setEmail('');
            setPassword('');
        }
    }, [userNotFound, tooManyRequests]);

    const validateForm = () => {
        const newErrors = {
            email: !utils.validString(email) || !email.includes('@'),
            password: !utils.validString(password) || password.length < 6
        }
        setErrors(newErrors);
        if (newErrors.email || newErrors.password) return false;
        return true;
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        if (validateForm()){ 
            try {
                await doSignInWithEmailAndPassword(email, password);
                setUserNotFound(false);
                setTooManyRequests(false);
            } catch(e) {
                // Display a message to the user if they sign in with invalid credentials
                if (e.code === errorCodes.tooManyRequests) setTooManyRequests(true);
                if (e.code === errorCodes.userNotFound || e.code === errorCodes.wrongPassword) setUserNotFound(true);
                console.log(e);
            }
        }
    };

    // const passwordReset = (event) => {
        
    // };

    if (currentUser) return <Redirect to="/home"></Redirect>
    return (
        <Container className="Login edit-container shadow-lg">
            <h2 className="border-bottom pb-3 mb-4 mx-5">Login</h2>
            { userNotFound && 
                <Alert variant="danger" className="login-error pb-0 mb-3">
                    <p>{tooManyRequests ? 'Too many attempts':'Email or password is incorrect'}</p>
                </Alert>
            }
            <Form noValidate onSubmit={handleLogin}>
                <Form.Group size="lg" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                        required
                        autoFocus 
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors({
                                ...errors,
                                email: false
                            })
                        }}
                        isInvalid = {errors.email || userNotFound}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter a valid email.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        required
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrors({
                                ...errors,
                                password: false
                            });
                        }}
                        isInvalid = {errors.password || userNotFound}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter a valid password.
                    </Form.Control.Feedback>
                </Form.Group>
                <Button block size="lg" variant="primary" type="submit">
                    Login
                </Button>
                <Container className="pr-0 mt-2 right-align">
                    <small>
                        New to WhatsCooking?
                        <Link className="ml-1" to="/signup">Sign up</Link>
                    </small>
                </Container>
            </Form>
        </Container>
    );
};

export default Login;