import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css';

function Navigation({ isLoaded }){
    const sessionUser = useSelector(state => state.session.user);

    let sessionLinks;
    if (sessionUser) {
      sessionLinks = (
        <ProfileButton user={sessionUser} />
      );
    } else {
      sessionLinks = (
        <>
          <LoginFormModal />
          <NavLink to="/signup">Sign Up</NavLink>
        </>
      );
    }

    return (
        <div className="navigation-container">
            <div className="home-link">
              <NavLink exact to="/">Home</NavLink>
            </div>
            <div className="login-signup">
              <span className="create-spot">
                <NavLink to="/spots">Become a Host</NavLink>
              </span>
              {isLoaded && sessionLinks}
            </div>
        </div>
    );
  }

export default Navigation;
