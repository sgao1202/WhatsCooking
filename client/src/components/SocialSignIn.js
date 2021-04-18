import React from 'react';
import { doGoogleSignIn } from '../firebase/FirebaseFunctions';

const SocialSignIn = () => {
    const socialSignOn = async () => {
        try {
            await doGoogleSignIn();
        } catch (e) {
            alert(e);
        }
    }
    return (
        <div>
            <img
                onClick={() => socialSignOn()}
                alt="google signin"
                src="/"
            />
        </div>
    );
};

export default SocialSignIn