import React, { useState, Fragment, useEffect } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios'
import PostItem from './PostItem';

const Dashboard = ({ auth: {user}}) => {

    const [text, setText] = useState('')
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose File');

    const onChange = e => {
      setFile(e.target.files[0]);
      setFilename(e.target.files[0].name);
   };

  const onSubmit = async e =>{
      e.preventDefault();
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('name', text);
      console.log(formData);

      try {
        if(file){
          const res = await axios.post('/upload', formData, {
              headers: {
                 'Content-Type': 'multipart/from-data',
                 'enctype': 'multipart/form-data'
              }
          });
          console.log(res.data.Loc[0]);

        }
        window.location.href=window.location.href;


      }catch(err){
          console.log(err);
      }
  }

    return (

      <div class="post-form">
        <form
        className='form my-1'
        onSubmit={onSubmit}
      >
          <input
          type='text'
          name='text'
          placeholder='Name the file'
          value={text}
          onChange={e => setText(e.target.value)}
          required
        />
        <Fragment>
            <form onSubmit={onSubmit} encType="multipart/form-data">
                <div className="custom-file mb-4">
                    <input type="file" className="custom-file-input" id="customFile" name='avatar' onChange={ onChange }/>
                    <label className="custom-file-label" htmlFor="customFile">{filename}</label>
                </div>
            </form>
        </Fragment>
        <button type='submit' className='btn my'>Upload Document</button>
      </form>
      { user ? (
      <div className="posts" style={{marginTop:"3rem"}}>
          {user.link.map((link) => (
            <PostItem key={link._id} link={link} />
          ))}
        </div>
    ) : null }
      

    </div>
    )
}

Dashboard.propTypes = {
    auth: PropTypes.object.isRequired,

}
const mapStateToProps = state => ({

    auth: state.auth,

})

export default connect(mapStateToProps)(Dashboard)
