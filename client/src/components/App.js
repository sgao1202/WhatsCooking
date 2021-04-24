import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Navbar, Container, Row, Col } from 'react-bootstrap';
import { AuthProvider } from '../firebase/Auth';
import Navigation from './Navigation';
import Landing from './Landing';
import Login from './Login';
import Profile from './Profile';
import Recipe from './Recipe';
import SignUp from './SignUp';

function App() {
  return (
    <AuthProvider>
      <Router>
            {/* <Navbar className="top-bar border-bottom rounded-bottom rounded-lg pt-4" bg="gray">
                <Navbar.Brand>
                    <Link to="/">
                        <img src={logo} className="App-logo d-inline-block align-top" alt="whats-cooking-logo"></img>
                    </Link>
                </Navbar.Brand>
            </Navbar> */}
            <Navigation></Navigation>
            <Container className="mt-5">
                <Route exact path="/" component={Landing}></Route>
                <Route exact path="/login" component={Login}></Route>
                
                {/* <Route exact path="/signup" component={SignUp}></Route> */}
                <Route exact path="/profile" component={Profile}></Route>
                <Route exact path="/recipe/:id" component={Recipe}></Route>
            </Container>
      </Router> 
    </AuthProvider>
  );
}

export default App;
