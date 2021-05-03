/* eslint-disable no-unused-vars */
import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Dashboard from './components/layout/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
import { loadUser } from './actions/auth';
import PrivateRoute from './components/routing/PrivateRoute';
import Post from './components/post/Post';
import NotFound from './components/layout/NotFound'
import TestModel from './components/post/TestModel'

// import * as tf from "@tensorflow/tfjs";
// import * as mlmodel from './tf/model.json';
// import * as testData from './tf/sample-sheet.csv'


//Redux
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './utils/setAuthToken';

if (localStorage.token){
  setAuthToken(localStorage.token);
}
const App = () => {
  useEffect(()=>{
    store.dispatch(loadUser());
    console.log('USeEffect was fired');
  });

  return (
    <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path='/' component={Landing} />
        <section className='container'>
          <Alert />
          <Switch>
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/testModel' component={TestModel} />
            <PrivateRoute exact path="/post/:id" component={ Post } />
            <PrivateRoute exact path="/dashboard" component={ Dashboard } />
            <Route component={NotFound} />
          </Switch>
        </section>
      </Fragment>
    </Router>
    </Provider>
  );
}

export default App;
