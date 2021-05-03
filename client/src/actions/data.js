import React from 'react';
import axios from 'axios';
import { setAlert } from './alert';
import {
    DATA_LOADED,
    DATA_ERROR
} from './types';


export const getData = (link, label) => async dispatch =>{
    try {

        const config = {
            headers:{
                'Content-type': 'application/json',
                "Connection": "keep-alive"
            }
        }
        const body = JSON.stringify({ link, label});
        console.log(body);
        const res = await axios.post('/api/post/mlModel', body, config);
        dispatch(setAlert('Processed', 'success'));
        dispatch({
            type: DATA_LOADED,
            payload: res.data
        });
    } catch (err) {
        dispatch(setAlert('Label is not correct', 'danger'));
        dispatch({
            type: DATA_ERROR,
            payload: {msg: 'whoopty', status: 'some status'}
        });
    }
}

export const getAllData = () => async dispatch =>{
    try {

        const config = {
            headers:{
                'Content-type': 'application/json',
                "Connection": "keep-alive"
            }
        }
        const res = await axios.get('/api/post/alldata', config);
        
        
    } catch (err) {
        dispatch(setAlert('something went wrong', 'danger'));
        dispatch({
            type: DATA_ERROR,
            payload: {msg: 'whoopty', status: 'some status'}
        });
    }
}

export const testModel = (testText) => async dispatch =>{
    try {

        const config = {
            headers:{
                'Content-type': 'application/json',
            }
        }
        const res = await axios.post('/api/post/model', { text: testText} ,config);
        return res
        
    } catch (err) {
        dispatch(setAlert('something went wrong', 'danger'));
        dispatch({
            type: DATA_ERROR,
            payload: {msg: 'whoopty', status: 'some status'}
        });
    }
}