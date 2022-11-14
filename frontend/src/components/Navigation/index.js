import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css';
import Ground from '../SVG/ground';
import titleImage from './groundbnb.png';
import { useState, useEffect } from "react";

function Navigation({ isLoaded }){
    const sessionUser = useSelector(state => state.session.user);
    const [showMenu, setShowMenu] = useState(false);

    const openMenu = () => {
      if (showMenu) return;
      setShowMenu(true);
    };

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
              <Ground/>
              <div className="groundbnb-text">
                <Link to="/"><img src={titleImage}/></Link>
              </div>
            </div>
            <div className="login-signup">
              <span className="create-spot">
                {/* conditionally render create spot, for non-users */}
                { sessionUser && <NavLink to="/spots">Become a Host</NavLink>}
              </span>
              {/* {isLoaded && sessionLinks} */}
              <button onClick={openMenu}>
                <i class="fa-solid fa-bars"></i>
                <i className="fas fa-user-circle" />
              </button>
              {showMenu && sessionLinks}
            </div>
        </div>
    );
  }

export default Navigation;
