import React, { useState, useEffect, useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import { AuthContext } from '../firebase/Auth';
import axios from 'axios';

const UserProfile = () => {
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        document.title = "My Profile";
    }, []);

    return (
        <Row>
            <Col>
                <h1 className="mb-5">{currentUser.displayName}</h1>
                <Row>
                    <Col>
                        <h2>My Posts</h2>
                    </Col>
                    <Col>
                        <h2>My Bookmarks</h2>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default UserProfile;