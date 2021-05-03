/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable no-unused-vars */
import { DATA_LOADED, DATA_ERROR } from '../actions/types';

const initialState = {
    data: [],
    loading: true,
    test: null,
    error: {}
}


export default function(state = initialState, action){
const { type, payload} = action;

    switch (type) {
        case DATA_LOADED:
            return { ...state, data: payload,test: payload.text, loading: false}
        case DATA_ERROR:
            return { ...state, error: payload, loading: false}
        default:
            return state;
    }
}