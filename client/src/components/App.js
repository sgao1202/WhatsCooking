import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AuthProvider } from '../firebase/Auth';
import Navigation from './Navigation';
import Landing from './Landing';
import Login from './Login';
import Profile from './Profile';
import Recipe from './Recipe';
import SignUp from './SignUp';
import Home from './Home';
import UserProfile from './UserProfile'
import '../App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
            <Navigation></Navigation>
            <Container className="mt-5">
                <Route exact path="/" component={Landing}></Route>
                <Route exact path="/login" component={Login}></Route>
                
                {/* <Route exact path="/signup" component={SignUp}></Route> */}
                <Route exact path="/profile" component={Profile}></Route>
                <Route exact path="/recipe/:id" component={Recipe}></Route>
                <Route exact path="/signup" component={SignUp}></Route>
                <Route exact path="/home" component={Home}></Route>
                <Route exact path="/profile" component={UserProfile}></Route>
            </Container>
      </Router> 
    </AuthProvider>
  );
}

export default App;