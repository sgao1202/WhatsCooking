import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormControl, Navbar } from 'react-bootstrap';
import { AuthContext } from '../firebase/Auth';
import logo from '../img/whats-cooking-logo.png';

const Navigation = () => {
    // If the user is not logged in then show Log In and Sign Up button in top right,
    // otherwise replace those buttons with their name and dropdown
    const { currentUser } = useContext(AuthContext);
    console.log(currentUser);
    return (
        <Navbar className="top-bar border-bottom rounded-bottom rounded-lg pt-4" bg="gray">
            <Navbar.Brand>
                <Link to="/">
                    <img src={logo} className="App-logo d-inline-block align-top" alt="whats-cooking-logo"></img>
                </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-brand"/>
            <Navbar.Collapse className="">
                    <Container>
                        {/* <Form inline>
                            <FormControl className="mr-3" type="text"/>
                            <Button variant="outline-primary">Search</Button>
                        </Form> */}
                    </Container>
                    <div className="row">
                            <Link className="mr-3" to="/login">
                                <Button variant="outline-primary">Log In</Button>
                            </Link>
                            <Link className="mr-3" to="/signup">
                                <Button variant="outline-primary">Sign Up</Button>
                            </Link>
                    </div>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Navigation;