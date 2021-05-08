import React, { useState, useEffect } from 'react';
import firebaseApp from './Firebase';
import axios from 'axios';

const AuthContext = React.createContext();
const url = 'http://localhost:3001'

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userMongo, setUserMongo] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        firebaseApp.auth().onAuthStateChanged((user) => {
            setCurrentUser(user);
            setLoadingUser(false);
        });
    }, []);

    // When the user signs in pull data from MongoDB
    useEffect(() => {
        if (currentUser) {
            let uid = currentUser.uid;
            async function fetchUser() {
                setLoadingUser(true);
                
                setLoadingUser(false);
            }
            fetchUser();
        }
    }, [currentUser]);

    if (loadingUser) return <div>Loading...</div>;
    return (
        <AuthContext.Provider value={{ currentUser, url: url }}>
            {children}
        </AuthContext.Provider>
    );
};

export {
    AuthContext,
    AuthProvider
}