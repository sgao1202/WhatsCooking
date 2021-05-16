import firebase from 'firebase/app';

async function doCreateUserWithEmailAndPassword(email, password, displayName) {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    let currentUser = firebase.auth().currentUser;
    // Store displayName and profile picture in photoUrl (empty on initial create);
    await currentUser.updateProfile({ displayName: displayName, photoURL: ''});
    await firebase.auth().updateCurrentUser(currentUser);
    return currentUser;
}

async function doChangePassword(email, oldPassword, newPassword) {
    const credential = firebase.auth.EmailAuthProvider.credential(
        email,
        oldPassword
    );
    await firebase.auth().currentUser.reauthenticateWithCredential(credential);
    await firebase.auth().currentUser.updatePassword(newPassword);
    await doSignOut();
}

async function doSignInWithEmailAndPassword(email, password) {
    await firebase.auth().signInWithEmailAndPassword(email, password);
}

// We only allow signup/sign with email or Google
async function doGoogleSignIn() {
    await firebase.auth().signInWithPopup('google');
}

async function doPasswordReset(email) {
    await firebase.auth().sendPasswordResetEmail(email);
}

async function doPasswordUpdate(password) {
    await firebase.auth().updatePassword(password);
}

async function doSignOut() {
    await firebase.auth().signOut();
}

export {
    doCreateUserWithEmailAndPassword,
    doGoogleSignIn,
    doSignInWithEmailAndPassword,
    doPasswordReset,
    doPasswordUpdate,
    doSignOut,
    doChangePassword
};