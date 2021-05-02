import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'
import {Container, Button, Row, Col, Jumbotron} from 'react-bootstrap';

const Landing = (props) => {
    useEffect(() => {
        document.title = 'Welcome!';
    }, []);
    
    return (
        <Container>
            <Jumbotron>
                <h1>Welcome to WhatsCooking!</h1>
                <p>
                    This is a social media platform where people can connect and share recipes about food, the universal language.
                </p>
                <p>
                    <Link to="/home">
                        <Button variant="primary">Go to home</Button>
                    </Link>
                </p>
            </Jumbotron>
        </Container>
    );
};

export default Landing;