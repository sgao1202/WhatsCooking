import React, { useState, useContext } from 'react';
import SocialSignIn from './SocialSignIn'
import { Redirect } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { AuthContext } from '../firebase/Auth';
import { doSignInWithEmailAndPassword, doPasswordReset } from '../firebase/FirebaseFunctions';

const Login = () => {
    const { currentUser } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            await doSignInWithEmailAndPassword(email, password);
        } catch(e) {
            alert(e);
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
            <Form onSubmit={handleLogin}>
                <Form.Group size="lg" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                        autoFocus 
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button block size="lg" variant="primary" type="submit" disabled={!validForm()}>
                    Login
                </Button>
            </Form>
        </div>
    );
};

export default Login;