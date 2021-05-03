import React,{Fragment, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import { getData } from '../../actions/data'
import { connect } from 'react-redux';
import Spinner from '../layouts/Spinner';

const Data = ({getData ,data: {link, gibberish, notGibberish}, auth:{user}}) => {
    return (
        <div>
            
        </div>
    )
}

Data.propTypes = {
    auth: PropTypes.object.isRequired,
    getData: PropTypes.func.isRequired,
}

const mapStateToProps = state =>({
    data: state.data,
    auth: state.auth
})

export default connect(mapStateToProps, {getData})(Data)
