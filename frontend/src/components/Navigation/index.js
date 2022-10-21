import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import './Navigation.css';
import Ground from '../SVG/ground';
import titleImage from './groundbnb.png';

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
              {isLoaded && sessionLinks}
            </div>
        </div>
    );
  }

export default Navigation;
