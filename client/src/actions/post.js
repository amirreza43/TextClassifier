import React, {   useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { setAlert } from './alert'
import { GET_LINKS, LINK_ERROR, UPLOAD_SUCCESS, DELETE_POST, DATA_ERROR } from './types'


//Add post
export const addFile = formData => async dispatch => {

    try {
        
        const config = {
            headers:{
                'Content-type': 'application/json'
            }
        }
        const res = await axios.post('/upload', formData, config);

        dispatch({
            type: UPLOAD_SUCCESS,
            payload: res.data
        });

        

        dispatch(setAlert('File Uploaded', 'success'));
    } catch (err) {
        dispatch({
            type: LINK_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        });
        
    }
}

//get all links
export const getLink = id => async dispatch => {
    try {
        const res = await axios.get(`/api/post/${id}`);

        dispatch({
            type: GET_LINKS,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: LINK_ERROR,
            payload: {msg: err.response.statusText, status: err.response.status}
        });
    }
}

//Delete post
export const deletePost = (data_id, link_id) => async dispatch => {
    try {
        const res = await axios.delete(`/api/post/${data_id}/${link_id}`);


        dispatch({
            type: DELETE_POST,
            payload: link_id
        });

        dispatch(setAlert('Document Deleted', 'success'));

    } catch (err) {
        dispatch({
            type: DELETE_POST,
            payload: link_id
        });
        
    }
}