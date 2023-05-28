import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

import profileImage from '../assets/icon_round.png';

const cookies = new Cookies();

// Alle Variablen initialisieren und auf Null setzen
const initialState = {
  fullName: '',
  username: '',
  password: '',
  confirmPassword: '',
  avatarURL: '',
};

// Auth-Komponente
const Auth = () => {
  const [form, setForm] = useState(initialState); // Zustand für das Formular und seine Werte
  const [isSignup, setIsSignup] = useState(true); // Zustand für die Anmelde-/Registrierungsanzeige

  // Änderungen im Formular behandeln und den Zustand aktualisieren
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Wenn das Formular abgeschickt wird, werden die eingegebenen Werte mit Axios an das Backend auf Port 5000 gesendet.
  // Die eingegebenen Daten werden auch als Browser-Cookies gespeichert, um sie beim Neuladen beizubehalten und zum Chat-Frontend zu gelangen.
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password, phoneNumber, avatarURL } = form;

    const URL = 'http://localhost:5000/auth';

    // Axios-Anfrage senden und die Antwortdaten extrahieren
    const {
      data: { token, userId, hashedPassword, fullName },
    } = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, {
      username,
      password,
      fullName: form.fullName,
      phoneNumber,
      avatarURL,
    });

    // Cookies setzen
    cookies.set('token', token);
    cookies.set('username', username);
    cookies.set('fullName', fullName);
    cookies.set('userId', userId);

    if (isSignup) {
      cookies.set('phoneNumber', phoneNumber);
      cookies.set('avatarURL', avatarURL);
      cookies.set('hashedPassword', hashedPassword);
    }

    // Seite neu laden
    window.location.reload();
  };

  // Funktion zum Wechseln zwischen Anmelde- und Registrierungsmodus
  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
  };

  return (
    <div className="login">
      <img src={profileImage} alt="" />
      <h3>Willkommen zu</h3>
      <h2>ChetChet</h2>
      <form onSubmit={handleSubmit}>
        {/* Anzeige des vollen Namens nur im Registrierungsmodus */}
        {isSignup && (
          <div className="login-form">
            <label htmlFor="fullName"></label>
            <input
              name="fullName"
              type="text"
              placeholder="Vor- und Nachname"
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
            placeholder="Nutzername"
            onChange={handleChange}
            required
          />
        </div>
        <div className="login-form">
          <label htmlFor="password"></label>
          <input
            name="password"
            type="password"
            placeholder="Passwort"
            onChange={handleChange}
            required
          />
        </div>
        {/* Passwortbestätigung nur im Registrierungsmodus */}
        {isSignup && (
          <div className="login-form">
            <label htmlFor="confirmPassword"></label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Passwort wiederholen"
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="login-button">
          <button>{isSignup ? 'Registrieren' : 'Einloggen'}</button>
        </div>
      </form>
      <div className="login-change">
        <p>
          {isSignup ? 'Schon ein Account? ' : 'Kein Account? '}
          <span onClick={switchMode}>
            {isSignup ? 'Einloggen' : 'Registrieren'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;