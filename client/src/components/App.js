import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Navbar from './Navbar';
import Login from './Login';
import Signup from './Signup';
import BookIndex from './BookIndex';
import Home from './Home';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup} />
                    <Route path="/BookIndex" component={BookIndex} />
                    <Route path="/" component={Home} />
                    {/* Add more routes here */}
                </Switch>
            </Router>
        </AuthProvider>
    );
};

export default App;