import React, { useState, useContext } from 'react';
import SocialSignIn from './SocialSignIn'
import { Redirect, Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { AuthContext } from '../firebase/Auth';
import { doSignInWithEmailAndPassword, doPasswordReset } from '../firebase/FirebaseFunctions';
import utils from '../lib/Utility';

const Login = () => {
    const { currentUser } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false);

    const validateForm = () => {
        if (!utils.validString(email) || !utils.validString(password)) return false;
        return true;
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setValidated(true);
        if (validateForm()){ 
            try {
                await doSignInWithEmailAndPassword(email, password);
            } catch(e) {
                alert(e);
            }
        }
    };

    // const passwordReset = (event) => {
        
    // };

    const validForm = () => {
        return email.length > 0 && password.length > 0;
    };

    if (currentUser) return <Redirect to="/"></Redirect>
    return (
        <div className="Login">
            <Form noValidate validated = {validated} onSubmit={handleLogin}>
                <Form.Group size="lg" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                        required
                        autoFocus 
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter a valid email.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-0" size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        required
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter a valid password.
                    </Form.Control.Feedback>
                </Form.Group>
                <div className="my-2 forgot-password">
                    <Link>
                        <small>Forgot password?</small>
                    </Link>
                </div>
                <Button block size="lg" variant="primary" type="submit" disabled={!validForm()}>
                    Login
                </Button>
            </Form>
        </div>
    );
};

export default Login;