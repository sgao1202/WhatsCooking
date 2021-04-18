
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Profile from './components/Profile';
import Recipe from './components/Recipe';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <div className="App-body">
            <Route exact path="/profile" component={Profile}></Route>
            <Route exact path="/recipe/:id" component={Recipe}></Route>
        </div>
      </Router>
    </div>
  );
}

export default App;
