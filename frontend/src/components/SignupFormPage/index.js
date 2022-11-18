import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import './SignupForm.css';

function SignupFormPage({ setShowModal }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === confirmPassword) {
      setErrors([]);
      // added firstName, lastName attributes to signup
      return dispatch(sessionActions.signup({ firstName, lastName, email, username, password }))
        .then(() => setShowModal(false))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }
    return setErrors(['Confirm Password field must be the same as the Password field']);
  };

  return (
    <form onSubmit={handleSubmit}>
      <ul>
        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>
      <div className="signup-info-container">
        <label className="first-name-info">
          First Name
          <input
            className="first-name-input"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <label className="last-name-info">
          Last Name
          <input
            className="last-name-input"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <label className="email-info">
          Email
          <input
            className="email-input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="username-info">
          Username
          <input
            className="username-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label className="password-info-signup">
          Password
          <input
            className="password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label className="confirmed-password-info">
          Confirm Password
          <input
            className="confirmed-password-input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button className="sign-up-button" type="submit">Sign Up</button>
      </div>
    </form>
  );
}

export default SignupFormPage;
