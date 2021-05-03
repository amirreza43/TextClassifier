/* eslint-disable import/no-anonymous-default-export */
import { LOGOUT,REGISTER_FAIL, REGISTER_SUCCESS, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, DELETE_POST } from '../actions/types';

const initialSate = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
}

export default function(state = initialSate, action){
    const{type, payload} = action;

    switch (type) {
        case REGISTER_SUCCESS:
            localStorage.setItem('token', payload.token);
            return { ...state, ...payload, isAuthenticated: true, loading: false }
        case REGISTER_FAIL:
            localStorage.removeItem('token');
            return { ...state, token: null, isAuthenticated: false, loading: false }
        case USER_LOADED:
            return { ...state, isAuthenticated: true, loading: false, user: payload }
        case AUTH_ERROR:
            localStorage.removeItem('token');
            return { ...state, token: null, isAuthenticated: false, loading: false }
        case LOGIN_SUCCESS:
            localStorage.setItem('token', payload.token);
            return { ...state, ...payload, isAuthenticated: true, loading: false }
        case LOGIN_FAIL:
            localStorage.removeItem('token');
            return { ...state, token: null, isAuthenticated: false, loading: false }
        case LOGOUT:
        localStorage.removeItem('token');
        return { ...state, token: null, isAuthenticated: false, loading: false }
        case DELETE_POST:
            return {
                ...state,
                user: {
                    ...state.user, 
                    link: state.user.link.filter(link => link._id !== payload)
                },
                loading: false
            }
        default:
            return state;
    }
}