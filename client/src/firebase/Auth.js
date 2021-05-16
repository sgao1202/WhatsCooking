import React, { useState, useEffect } from 'react';
import firebaseApp from './Firebase';
import { Container, Spinner } from 'react-bootstrap';
import UserProfile from '../components/UserProfile';
import axios from 'axios';

const AuthContext = React.createContext();
const baseUrl = 'http://localhost:3001'

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentProfile, setCurrentProfile] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        firebaseApp.auth().onAuthStateChanged(async (user) => {
            setLoadingUser(true);
            // User signs in 
            if (user) {
                try {
                    const { data } = await axios.get(`${baseUrl}/users/uid/${user.uid}`);
                    setCurrentProfile(data);
                } catch (e) {
                    console.log(e);
                    alert(e);
                }
            } else setCurrentProfile(null);
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
    );
    
    return (
        <AuthContext.Provider value={{ currentUser, currentProfile, baseUrl: baseUrl }}>
            {children}
        </AuthContext.Provider>
    );
};

export {
    AuthContext,
    AuthProvider
}