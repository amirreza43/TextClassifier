/* eslint-disable import/no-anonymous-default-export */
import React from 'react'
import PropTypes from 'prop-types';
import { GET_LINKS, UPLOAD_SUCCESS, LINK_ERROR, DELETE_POST} from '../actions/types'

const initialState = {
    links: [],
    link: null,
    loading: true,
    error: {},
    messages: [],
}


export default function(state= initialState, action){

    const { type, payload } = action;

    switch(type){
        case UPLOAD_SUCCESS:
            return {
                ...state,
                links:payload,
                loading: false
            }
        
        case LINK_ERROR:
            return {
                ...state,
                error:payload,
                loading: false
            }
        case GET_LINKS:
            return {
                ...state,
                posts:payload,
                loading: false
            }

        
        default:
            return state;
    }

}
