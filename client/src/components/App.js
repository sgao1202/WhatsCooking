import logo from '../logo.svg';
import '../App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Landing from './Landing';
import SignIn from './SignIn';
import SignUp from './SignUp';

function App() {
  return (
    <Router>
      <Route exact path="/" component={Landing}></Route>
      <Route exact path="/signin" component={SignIn}></Route>
      <Route exact path="/singup" component={SignUp}></Route>
    </Router>
  );
}

export default App;
