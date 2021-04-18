import React, { useContext } from 'react';
import SocialSignIn from './SocialSignIn'
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import { doSignInWithEmailAndPassword, doPasswordReset } from '../firebase/FirebaseFunctions';

const SignIn = () => {
    const { currentUser } = useContext(AuthContext);
    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            await doSignInWithEmailAndPassword();
        } catch(e) {
            alert(e);
        }
    };

    const passwordReset = (event) => {

    };

    return (
        <div>
            <h1>Log In</h1>
            <form onSubmit={handleLogin}>
                
            </form>
        </div>
    );
};

export default SignIn;