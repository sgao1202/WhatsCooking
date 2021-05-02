import React, { useState, useEffect, useContext } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { AuthContext } from '../firebase/Auth';

const UserProfile = () => {
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        document.title = "My Profile";
    }, []);

    return <div>This is the user profile page</div>
};

export default UserProfile;