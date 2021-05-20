import { Container } from 'react-bootstrap';
import { FaRegSadTear } from 'react-icons/fa';

const Error = () => {
    return (
        <Container className="text-center">
            <h1><FaRegSadTear className="mr-3"/>404 - Page not found</h1>
        </Container>
    );

};

export default Error;
