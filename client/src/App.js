
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Profile from './components/Profile';
import Recipe from './components/Recipe';
import './App.css';

function App() {
  return (
      <Router>
            <Route exact path="/profile" component={Profile}></Route>
            <Route exact path="/recipe/:id" component={Recipe}></Route>
      </Router>
  );
}

export default App;
