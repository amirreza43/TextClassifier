import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { testModel } from '../../actions/data';


const TestModel = ({testModel, data }) => {
    // testModel('this is a test')
    const [text, setText] = useState('');
    const [res, setRes] = useState('');

    const onChange = e => {
        setText(e.target.value);
     };
     const onSubmit = async e =>{

        e.preventDefault();
        var x = await testModel(text)
        setRes(x.data)
        console.log(res);
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
          onChange={ onChange}
          required
        />
        <button type='submit' className='btn my'>Test Our Model</button>
      </form>
    <h1 class="display-5 mt-5">Our model determined that your text is:</h1>
    <h1 class="display-3 mt-5" value={res}>{res}</h1>

        </div>
    );
};


TestModel.propTypes = {
    testModel: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    data: state.data,
  });

export default connect(
    mapStateToProps, {testModel})(TestModel);