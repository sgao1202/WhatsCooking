import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../firebase/Auth';
import { Link } from 'react-router-dom';
import { Button, Container, Form, Row, Spinner } from 'react-bootstrap';
import axios from 'axios';
import utils from '../lib/Utility';

const ProfileEdit = () => {
    const { currentUser, baseUrl} = useContext(AuthContext);
    const [profileInfo, setProfileInfo] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [aboutMe, setAboutMe] = useState('');

    useEffect(() => {
        document.title = 'Edit Profile';
        async function fetchUser() {
            setLoading(true);
            try {
                // Only get the user with their uid
                const { data } = await axios.get(`${baseUrl}/users/uid/${currentUser.uid}`);
                setProfileInfo(data);
            } catch (e) {
                console.log(e);
                alert(e);
            }
            setLoading(false);
        }
        fetchUser();
    }, []);

    const updateUser = async () => {

    };

    const isValidForm = () => {
        if (!utils.validString(firstName) || !utils.validString(lastName) || !utils.validString(aboutMe)) return false;

        return true;
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        if (isValidForm()) updateUser();
    };

    // Load spinner
    if (loading) return (
        <Container className="text-center">
            <Spinner animation="border"></Spinner>
        </Container>
    );
    
    return (
        <Container>
            <Form>
                <Form.Group controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        defaultValue={profileInfo.firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        defaultValue={profileInfo.lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="aboutMe">
                    <Form.Label>About Me</Form.Label>
                    <Form.Control 
                        type="text" 
                        defaultValue={profileInfo.aboutMe}
                        onChange={(e) => setAboutMe(e.target.value)}
                    />
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