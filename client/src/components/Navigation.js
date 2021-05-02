import React, { useContext, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button, Col, Container, Navbar, Row} from 'react-bootstrap';
import { AuthContext } from '../firebase/Auth';
import { doSignOut } from '../firebase/FirebaseFunctions';
import logo from '../img/whats-cooking-logo.png';

const Navigation = () => {
    // If the user is not logged in then show Log In and Sign Up button in top right,
    // otherwise replace those buttons with their name and dropdown
    const { currentUser } = useContext(AuthContext);
    const [signedOut, setSignedOut] = useState(false);
    console.log(currentUser);

    // Logout function
    const logout = async () => {
        await doSignOut();
        setSignedOut(true);
    };

    // If the user is signed out, redirect the user to the /home page and force a re-render
    if (signedOut) {
        setSignedOut(false);
        return <Redirect to="/home"></Redirect>
    }

    return (
        <Navbar className="top-bar border-bottom rounded-bottom rounded-lg pt-4" bg="gray">
            <Navbar.Brand>
                <Link to="/">
                    <img src={logo} className="App-logo d-inline-block align-top" alt="whats-cooking-logo"></img>
                </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-brand"/>
            <Navbar.Collapse>
                    <Container>
                        {/* <Form inline>
                            <FormControl className="mr-3" type="text"/>
                            <Button variant="outline-primary">Search</Button>
                        </Form> */}
                    </Container>
                    <div className="row">
                            {currentUser ? <div className="col">
                                <Button onClick={logout} variant="outline-primary mr-5">Log Out</Button></div> : 
                                <div className="col>">
                                    <Link className="mr-3" to="/login">
                                    <Button variant="outline-primary">Log In</Button>
                                    </Link>
                                    <Link className="mr-5" to="/signup">
                                        <Button variant="outline-primary">Sign Up</Button>
                                    </Link>
                                </div>
                            }
                    </div>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Navigation;