import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import post from './post';
import data from './data';




export default combineReducers({
    alert,
    auth,
    post,
    data
});