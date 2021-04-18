import logo from '../logo.svg';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AuthProvider } from '../firebase/Auth';
import Landing from './Landing';
import Login from './Login';
import SignUp from './SignUp';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header">
          <h1>WhatsCooking</h1>
        </header>
        <Container>
          <Router>
            <Route exact path="/" component={Landing}></Route>
            <Route exact path="/login" component={Login}></Route>
            {/* <Route exact path="/signup" component={SignUp}></Route> */}
          </Router>
        </Container>
      </div>
    </AuthProvider>
  );
}

export default App;
