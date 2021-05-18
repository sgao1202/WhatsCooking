import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { Alert, Button, Container, Form, Spinner } from 'react-bootstrap';
import { AuthContext } from '../firebase/Auth';
import { doCreateUserWithEmailAndPassword } from '../firebase/FirebaseFunctions';
import axios from 'axios';
import utils from '../lib/Utility';

const SignUp = () => {
    const { currentProfile, updateProfile, baseUrl } = useContext(AuthContext);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [aboutMe, setAboutMe] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [userAlreadyExists, setUserAlreadyExists] = useState(false);
    const emailAlreadyExists = 'auth/email-already-in-use';

    useEffect(() => {
        document.title = "Sign Up";
    }, []);
    
    useEffect(() => {
        if (userAlreadyExists) {
            setEmail('');
        }
    }, [userAlreadyExists]);

    // Custom validation for fields
    const validateForm = () => {
        const newErrors = {
            firstName: !utils.validString(firstName),
            lastName: !utils.validString(lastName),
            email: !utils.validString(email) || !email.includes('@'),
            password: !utils.validString(password) || password.length < 6
        };
        setErrors(newErrors);
        if (newErrors.firstName || newErrors.lastName || newErrors.email || newErrors.password) return false;
        return true;
    };
    
    const createUser = async () => {
        try {
            const user = await doCreateUserWithEmailAndPassword(email, password, `${firstName} ${lastName}`);
            // Give the user a default profile picture
            const { data } = await axios.post(`${baseUrl}/users`, {
               uid: user.uid,
               firstName: firstName,
               lastName: lastName,
               profilePicture: "generic-user-profile.jpg"
            });
            updateProfile(data);
            setUserAlreadyExists(false);
        } catch (e) {
            if (e.code === emailAlreadyExists) setUserAlreadyExists(true);
            console.log(e);
        }
    }

    const handleSignUp = (event) => {
        event.preventDefault();
        setLoading(true);
        if (validateForm()) createUser();
        setLoading(false);
    };

    const validForm = () => {return email.length > 0 && password.length > 0 && firstName.length > 0 && lastName.length > 0;};
    
    if (loading) return (
        <Container className="text-center">
            <Spinner animation="border"></Spinner>
        </Container>
    );

    if (currentProfile && !loading) return <Redirect to='/home'></Redirect>
    return (
        <div className="Login">
            {   userAlreadyExists &&
                <Alert variant="danger" className="login-error pb-0 mb-3">
                    <p>Email is already in use</p>
                </Alert>
            }
            <Form noValidate onSubmit={handleSignUp}>
                <Form.Group size="lg" controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        required
                        autoFocus
                        type="text"
                        value={firstName}
                        onChange={(e) => {
                            setFirstName(e.target.value)
                            setErrors({
                                ...errors.dictionary,
                                lastName: false
                            })
                        }}
                        placeholder="ex. Patrick"
                        isInvalid = {errors.firstName}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter a valid first name
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group size="lg" controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        value={lastName}
                        onChange={(e) => {
                            setLastName(e.target.value);
                            setErrors({
                                ...errors,
                                lastName: false
                            })
                        }}
                        placeholder="ex. Hill"
                        isInvalid={errors.lastName}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter a valid last name
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group size="lg" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        required
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors({
                                ...errors,
                                email: false
                            })
                        }}
                        placeholder="ex. phill@stevens.edu"
                        isInvalid={errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                        Email must contain '@' symbol
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group size="lg" controlId="password">
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
                            })
                        }}
                        placeholder="Password length must be at least 6"
                        isInvalid={errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                        Password length must be at least 6
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="aboutMe">
                    <Form.Label>About Me</Form.Label>
                    <Form.Control 
                        as="textarea"
                        rows="5"
                        placeholder="Tell us a little bit about yourself. Maybe some of your favorite cuisines, popular chefs, or even some of your favorite dishes!"
                        type="text" 
                        onChange={(e) => {
                            setAboutMe(e.target.value);
                            setErrors({
                                ...errors,
                                aboutMe: false
                            });
                        }}
                        isValid = {!!errors.aboutMe}
                        isInvalid = {errors.aboutMe}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter a valid about me section
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