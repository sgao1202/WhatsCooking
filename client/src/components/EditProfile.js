import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../firebase/Auth';
import { Link, Redirect} from 'react-router-dom';
import { Button, Container, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import utils from '../lib/Utility';

const ProfileEdit = () => {
    const { currentUser, baseUrl} = useContext(AuthContext);
    const [profileInfo, setProfileInfo] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [aboutMe, setAboutMe] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({
        firstName: false,
        lastName: false,
        aboutMe: false
    });

    useEffect(() => {
        document.title = 'Edit Profile';
        async function fetchUser() {
            setLoading(true);
            try {
                // Only get the user with their uid
                const { data } = await axios.get(`${baseUrl}/users/uid/${currentUser.uid}`);
                setProfileInfo(data);
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setAboutMe(data.aboutMe);
            } catch (e) {
                console.log(e);
                alert(e);
            }
            setLoading(false);
        }
        fetchUser();
    }, []);

    const updateUser = async () => {
        console.log('attempted');
        try {
            const user = await axios.patch(`${baseUrl}/users/${profileInfo._id}`, {
                firstName: firstName,
                lastName: lastName,
                aboutMe: aboutMe
            });
            setSubmitted(true);
        } catch (e) {
            console.log(e);
            alert(e);
        }
    };

    const isValidForm = () => {
        let newErrors = {
            firstName: !utils.validString(firstName),
            lastName: !utils.validString(lastName),
            aboutMe: !utils.validString(aboutMe)
        }
        setErrors(newErrors);
        if (newErrors.firstName || newErrors.lastName || newErrors.aboutMe) return false;
        return true;
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        if (isValidForm()) updateUser();
        setLoading(false);
    };

    // Load spinner
    if (loading) return (
        <Container className="text-center">
            <Spinner animation="border"></Spinner>
        </Container>
    );
    if (submitted) return <Redirect to="/my-profile"></Redirect>;
    console.log('errors', errors);
    return (
        <Container className="edit-container shadow-lg p-5">
            <h2 className="border-bottom pb-3 mb-4">Edit Profile</h2>
            <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control 
                        autoFocus
                        type="text" 
                        defaultValue={profileInfo.firstName}
                        onChange={(e) => {
                            setFirstName(e.target.value);
                            setErrors({
                                ...errors,
                                firstName: false
                            });
                        }}
                        isInvalid = {errors.firstName}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter a valid first name
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        defaultValue={profileInfo.lastName}
                        onChange={(e) => {
                            setLastName(e.target.value);
                            setErrors({
                                ...errors,
                                lastName: false
                            });
                        }}
                        isInvalid = {errors.lastName}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter a valid last name
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="aboutMe">
                    <Form.Label>About Me</Form.Label>
                    <Form.Control 
                        type="text" 
                        defaultValue={profileInfo.aboutMe}
                        onChange={(e) => {
                            setAboutMe(e.target.value);
                            setErrors({
                                ...errors,
                                aboutMe: false
                            });
                        }}
                        isInvalid = {!!errors.aboutMe}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter a valid about me section
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Button type="submit">
                        Save Changes
                    </Button>
                    <Link className="ml-3" to="/my-profile"><span>Cancel</span></Link>
                </Form.Group>
            </Form>
        </Container>
    );
};

export default ProfileEdit;