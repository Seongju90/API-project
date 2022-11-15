import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import Ground from '../SVG/ground';
import titleImage from './groundbnb.png';
import { useState } from "react";
import { Modal } from '../../context/Modal';
import LoginForm from '../LoginFormModal/LoginForm';
import SignupFormPage from '../SignupFormPage';

function Navigation({ isLoaded }){
    const sessionUser = useSelector(state => state.session.user);
    const [ showModal, setShowModal ] = useState(false)
    const [ login, setLogin ] = useState(true)

    return (
        <div className="navigation-container">
            <div className="home-link">
              <Ground/>
              <div className="groundbnb-text">
                <Link to="/"><img alt="groundbnb-title" src={titleImage}/></Link>
              </div>
            </div>
            <div className="button-and-hostlink">
              <span className="create-spot">
                  {/* conditionally render create spot, for non-users */}
                  { sessionUser && <NavLink to="/spots">Become a Host</NavLink>}
              </span>
              <div className="profile-button">
                {isLoaded && (
                  <ProfileButton
                    user={sessionUser}
                    setLogin={setLogin}
                    setShowModal={setShowModal}
                  />
                )}
                </div>
                {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                  {login ? <LoginForm setShowModal={setShowModal}/>
                  : <SignupFormPage setShowModal={setShowModal}/>}
                </Modal>
                )}
            </div>
        </div>
    );
  }
export default Navigation;
