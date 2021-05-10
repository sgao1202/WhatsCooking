import React, { useState, useEffect } from 'react';
import firebaseApp from './Firebase';
import { Container, Spinner } from 'react-bootstrap';

const AuthContext = React.createContext();
const baseUrl = 'http://localhost:3001'

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        firebaseApp.auth().onAuthStateChanged(async (user) => {
            // User signs in 
            setCurrentUser(user);
            setLoadingUser(false);
        });
    }, []);

    if (loadingUser) return ( 
        <Container className="mt-5 text-center">
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        </Container>
    )
    return (
        <AuthContext.Provider value={{ currentUser, baseUrl: baseUrl }}>
            {children}
        </AuthContext.Provider>
    );
};

export {
    AuthContext,
    AuthProvider
}