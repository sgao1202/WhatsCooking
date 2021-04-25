import React, {useContext, useState, useEffect} from 'react';
import { AuthContext } from '../firebase/Auth';
import '../App.css';

const Profile = () => {
    const [userData, setUserData] = useState(undefined);

    /*
        must check for authorized account via firebase, then render.
        useContext to propogate user down to all child components
    */

    const { currentUser } = useContext(AuthContext);
    if (!currentUser) {
        //redirect to signin form
    }

    /* fields to display 
        First Name
        Last Name
        Profile Picture
        Bookmarks
        Following (should we have links to their account page? but with no editing allowed?)
        About Me
        My Recipes
    */

    return (
        <div className="Profile">
            <h1>Profile Details:</h1>
            <p className="prof-heading">First Name:</p>
            <p className="prof-info">Insert First Name here</p>
            <p className="prof-heading">Last Name:</p>
            <p className="prof-info">Insert Last Name here</p>
            <p className="prof-heading">About Me:</p>
            <p className="prof-info">Insert Description about yourself.</p>
            <br></br>
            <p className="prof-heading">Bookmarks:</p>
            <ul className="prof-info">
                <li>Bookmarked Recipes here</li>
            </ul>
            <p className="prof-heading">Following:</p>
            <ul className="prof-info">
                <li>List Followed Users here</li>
            </ul>
            
            <p className="prof-heading">My Recipes:</p>
            <ul className="prof-info">
                <li>List your recipes here.</li>
            </ul>
        </div>
    )

}

export default Profile;