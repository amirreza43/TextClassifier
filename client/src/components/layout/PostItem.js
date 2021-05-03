import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';



const PostItem = ({link: {_id, text, name }}) =>(
          
  
    <ul class="list-group">
    <li class="list-group-item"><Link to={`/post/${_id}`}>{name}</Link><Link className="btn btn-primary float-right" to={`/post/${_id}`}>Analyze</Link></li>
    </ul>
)
PostItem.propTypes = {
    auth: PropTypes.object.isRequired,
 
}

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, null)(PostItem)
