import React from 'react';
import { Button } from 'react-bootstrap';
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
        // <div>
        //     <img
        //         onClick={() => socialSignOn()}
        //         alt="google signin"
        //         src="/"
        //     />
        // </div>
        <ul>
            <li>
                <Button variant="outline-light" onClick={socialSignOn}>Continue with Google</Button>
            </li>
        </ul>
    );
};

export default SocialSignIn