import { useContext, useState, useEffect } from 'react';
import { Button, Container, Form, Spinner } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import bsCustomFileInput from 'bs-custom-file-input';
import axios from 'axios';

const UploadImage = () => {
    const { baseUrl, currentUser, currentProfile, updateProfile } = useContext(AuthContext);
    const [file, setFile] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [invalid, setInvalid] = useState(false);

    useEffect(() => {
        bsCustomFileInput.init();
    }, []);

    // Check file type
    const validateFile = () => {
        const validTypes = new Set(['png', 'jpg', 'jpeg']);
        let fileType = file.type;
        let extensionIndex = fileType.search('/');
        let extensionType = fileType.slice(extensionIndex + 1);
        if (!validTypes.has(extensionType)) {
            setInvalid(true);
            return false;
        }
        else setInvalid(false);
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        if (validateFile()) {
            try {
                const formData = new FormData();
                formData.append("file", file, file.name);
                // Post image to backend
                const imageId = await axios.post(`${baseUrl}/uploadImage`, formData);
                // Update user's profilePicture field
                const updateUser = await axios.patch(`${baseUrl}/users/${currentProfile._id}`, {
                    profilePicture: imageId.data
                });
                updateProfile(updateUser.data);
                setSubmitted(true);
            } catch (e) {
                console.log(e);
            }
        }
        setLoading(false);
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    console.log('currentUser', currentUser);
    console.log('userProfile', currentProfile);

    if (loading) return (
        <Container className="text-center">
            <Spinner animation="border"></Spinner>
        </Container>
    );

    if (submitted) return <Redirect to="/my-profile"></Redirect>

    return (
        <Container>
            <div className="border-bottom mb-4">
                <h1>Upload Profile Picture</h1>    
            </div>
            <Form className="col-6" encType="multipart/form-data" onSubmit={handleSubmit}>
                <Form.File className="mb-4" custom>
                    <Form.File.Input type="file" name="file" onChange={handleFileChange} isInvalid={invalid}></Form.File.Input>
                    <Form.File.Label>Choose file</Form.File.Label>
                    <Form.Control.Feedback type="invalid">
                        File must have an extension of 'jpg', 'jpeg', or 'png'
                    </Form.Control.Feedback>
                </Form.File>
                <Form.Group>
                    <Button variant="secondary" className="upload-button" type="submit" disabled={!file}>
                        Upload
                    </Button>
                    <Link className="text-secondary ml-3" to="/my-profile"><span>Cancel</span></Link>
                </Form.Group>
            </Form>
        </Container>
    );
};

export default UploadImage;