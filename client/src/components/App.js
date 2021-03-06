import '../styles/App.scss';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AuthProvider } from '../firebase/Auth';
import Navigation from './Navigation';
import Login from './Login';
import MyProfile from './MyProfile';
import EditProfile from './EditProfile';
import UploadImage from './UploadImage';
import Recipe from './Recipe';
import NewRecipe from './NewRecipe';
import SignUp from './SignUp';
import Home from './Home';
import PrivateRoute from './PrivateRoute';
import UserProfile from './UserProfile';
import Error from './Error';
import '../App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
          <Navigation></Navigation>
          <Container className="my-5">
            <Switch>
                <Route exact path="/">
                  <Redirect to="/home"></Redirect>
                </Route>
                <Route exact path="/login" component={Login}></Route>
                <Route exact path="/signup" component={SignUp}></Route>
                <Route exact path="/recipe/:id" component={Recipe}></Route>
                <Route exact path="/home" component={Home}></Route>
                <Route exact path="/users/:id" component={UserProfile}></Route>
                <PrivateRoute exact path="/newrecipe" component={NewRecipe}></PrivateRoute>
                <PrivateRoute exact path="/my-profile" component={MyProfile}></PrivateRoute>
                <PrivateRoute exact path="/my-profile/edit" component={EditProfile}></PrivateRoute>
                <PrivateRoute exact path="/my-profile/upload-image" component={UploadImage}></PrivateRoute>
                <Route component={Error}></Route>
            </Switch>
          </Container>
      </Router> 
    </AuthProvider>
  );
}

export default App;