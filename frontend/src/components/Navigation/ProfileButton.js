import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import './ProfileButton.css';

function ProfileButton({user, setLogin, setShowModal}) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  return (
    <>
      <button className="profile-button" onClick={openMenu}>
        <svg className="bars-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>
        <svg className="user-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM256 272c39.8 0 72-32.2 72-72s-32.2-72-72-72s-72 32.2-72 72s32.2 72 72 72z"/></svg>
      </button>
      {/* if user then show logout + user info, otherwise render Login/SignUp */}
      {showMenu && ( user ?
        (<div className="profile-dropdown">
          <div className="user-dropdown">{user.username}</div>
          <div className="email-dropdown">{user.email}</div>
          <div>
          <button className="logout-button-dropdown" onClick={logout}>Log Out</button>
          </div>
        </div>) :
        (<div className="profile-dropdown">
          <div className="login-dropdown">
            <button className="login-button-dropdown" onClick={() => {
              setLogin(true)
              setShowModal(true)
            }}>Log In</button>
          </div>
          <div className="signup-dropdown">
            <button className="signup-button-dropdown"onClick={() => {
              setLogin(false)
              setShowModal(true)
            }}>Sign Up</button>
          </div>
        </div>)
      )}
    </>
  );
}

export default ProfileButton;
