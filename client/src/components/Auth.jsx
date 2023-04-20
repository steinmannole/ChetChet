import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios'

import singinImage from '../assets/sign-background-blurred.jpg';
import profileImage from '../assets/icon_round.png';

const cookies = new Cookies();

const initialState = {
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    avatarURL: '',
}

const Auth = () => {
    const [form, setForm] = useState(initialState);
    const [isSignup, setIsSignup] = useState(true);

    const handleChange = (e) => {
        setForm({ ... form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const { username, password, phoneNumber, avatarURL } = form;

        const URL = 'http://localhost:5000/auth';

        const { data: { token, userId, hashedPassword, fullName } } = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, {
            username, password, fullName: form.fullName, phoneNumber, avatarURL,
        });

        cookies.set('token', token);
        cookies.set('username', username);
        cookies.set('fullName', fullName);
        cookies.set('userId', userId);
        
        if(isSignup) {
            cookies.set('phoneNumber', phoneNumber);
            cookies.set('avatarURL', avatarURL);
            cookies.set('hashedPassword', hashedPassword);
        }

        window.location.reload();
    }

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
    }

  return (
    <div className="login">
        <img src={profileImage} alt=""/>
        <h3>Willkommen zu</h3>
        <h2>ChetChet</h2>
        <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <div className="login-form">
                            <label htmlFor="fullName"></label>
                            <input
                                name="fullName"
                                type="text"
                                placeholder="Nutzername"
                                onChange={handleChange}
                                required
                            />
                        </div> 
                    )}
                        <div className="login-form">
                            <label htmlFor="username"></label>
                            <input
                                name="username"
                                type="text"
                                placeholder="Username"
                                onChange={handleChange}
                                required
                            />
                        </div> 
                        <div className="login-form">
                            <label htmlFor="password"></label>
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {isSignup && (
                        <div className="login-form">
                            <label htmlFor="confirmPassword"></label>
                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder="Passwort"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        )}
                    <div className="login-button">
                        <button>{isSignup ? "Register" : "Login"}</button>
                    </div>
                </form>
        <div className="login-change">
            <p>
                {isSignup
                ? "Schon ein Account? "
                : "Kein Account? "
                }
                <span onClick={switchMode}>
                    {isSignup ? 'Einloggen' : 'Registrieren'} 
                </span>
            </p>
            </div>   
    </div>
  )
}

export default Auth