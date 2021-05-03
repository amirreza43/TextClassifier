import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import { getAllData } from '../../actions/data'

const Navbar = ({getAllData ,auth: {isAuthenticated, loading, user}, logout }) => {

    let isAdmin = false;
    if(user){
        if(user.admin === 'true'){
            isAdmin = true
        }
    }
    console.log(isAdmin);
    const authLinks = (
        <ul>

            { isAdmin ? <a className="btn btn-primary float-right"
                href={`../files/alldata/alldata.csv`} onClick={getAllData()} download>Universal DataSheet</a>  : null }
            <a onClick={logout} className="btn btn-dark">Logout</a>
            <Link to="/testmodel" className="btn btn-primary">Test Our Model</Link>

            
        </ul>
    );

    const guestLinks = (
        <ul>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
                <Link to="/login" className="btn btn-light">Login</Link>
                <Link to="/testmodel" className="btn btn-primary">Test Our Model</Link>
                
            </ul>
    );

    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to="/"><i className="fas fa-code"></i> Text Classifier</Link>
            </h1>
    { !loading && (<Fragment>{ isAuthenticated ? authLinks : guestLinks }</Fragment>)}
        </nav>
    )
}
const mapSateToProps = state => ({
    auth: state.auth,
    getAllData: PropTypes.func.isRequired
})

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

export default connect(mapSateToProps, { logout, getAllData })(Navbar)