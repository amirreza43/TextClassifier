import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import PostItem from '../layout/PostItem';
import { getData } from '../../actions/data';
import { deletePost } from '../../actions/post'
import Spinner from '../layout/Spinner';


const Post = ({match, auth: {user}, getData, deletePost, data: {data, loading}}) => {
  const [label, setLabel] = useState('')
  var noLinks = null;
  var link = null;
  var link_id = null;
  var clicked = false;
  var datgib = null
  var datreal = null
  var datbot = null
  if(user){
     noLinks = Object.keys(user.link).length;
  }
  var chase = null
  for(var i = 0; i < noLinks; i++ ){
    if(user.link[i]._id === match.params.id){
       chase = user.link[i];
       link = chase.text
       link_id =  user.link[i]._id
       if(link === data.link){
        datgib = data['gibberish']
        datreal =data['real'] 
        datbot = data['bot']
      }
    }
    
  }
const onSubmit = async e =>{

  e.preventDefault();
  clicked = true
  setTimeout(() => { clicked = false; console.log(clicked); }, 1000);
  const formData = new FormData();
  formData.append('link', link);
  formData.append('label', label);
  getData(link, label);
  console.log(chase);

}


const deleteDoc = async (data , link_id) => {

  var data_id = null;
  if(data._id){

    data_id = data._id;

    await deletePost(data_id, match.params.id);
    return <Redirect to={{ pathname: '/dashboard' }} />

  } else {

    await deletePost('1kst', match.params.id);
    return <Redirect to={{ pathname: '/dashboard' }} />

  }
  
}

  return (


    <div>
      { chase ? ( 
          <div>
            {/* { label }
            { link } */}
            
            <PostItem key={chase._id} link={chase} />
            </div>
      ) : <Spinner /> }
      
      <form className='form my-1'
        onSubmit={onSubmit}>
        <div className="mb-3">
          
        </div>
        <button type='submit' className='btn btn-primary my'>Fetch Result</button>
      </form> 
      <div className={ (clicked ? 'show' : 'hidden') }>
      { loading & clicked ? <Spinner /> : null }
      { datgib || datreal || datbot ? [
          data['gibberish'].map((gib) => (
            <div>
              <ul className="list-group flex-fill list-group-horizontal">
              <li className="list-group-item flex-fill" >{gib.text}</li>
              <li className="list-group-item flex-fill">{gib.prediction}</li>
              </ul>
            </div>
          )),
          data['real'].map((gib) => (
            
            <div>
              <ul className="list-group flex-fill list-group-horizontal">
              <li className="list-group-item flex-fill">{gib.text}</li>
              <li className="list-group-item flex-fill">{gib.prediction}</li>
              </ul>
            </div>
          )),
          data['bot'].map((gib) => (
            <div>
            <div>
              <ul className="list-group flex-fill list-group-horizontal">
              <li className="list-group-item flex-fill">{gib.text}</li>
              <li className="list-group-item flex-fill">{gib.prediction}</li>
              </ul>
            </div>
            </div>
          ))
          ] 
          : null }
      </div>
          <a className="btn btn-primary float-right"
          href={`../files/${data['labelData']}`} download>Download the labeled Sheet</a>
          <Link className="btn btn-danger float-left" onClick={() => deleteDoc(data, link_id)} to='/dashboard'>Delete The Docmuennt</Link>
    </div>
    
    )
}

Post.propTypes = {
    auth: PropTypes.object.isRequired,
    getData: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
    data: state.data
  });
  
  export default connect(
    mapStateToProps, {getData, deletePost})(Post);
