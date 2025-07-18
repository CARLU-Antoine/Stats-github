import React, { useState } from 'react';
import { connexion, creerCompte } from '../services/authService';
import './login.css';
import fondGithub from '../asset/fond-github.png';
import LoginTabs from './login-tabs';

function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (activeTab === 'login') {
        const data = await connexion(username, password);
        console.log('Connecté!', data);
      } else {
        const data = await creerCompte(username, password);
        console.log('Compte créé!', data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <LoginTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="container-login-form">
          <div className="login-header">
            <h1 className="login-title">{activeTab === 'login' ? 'Se connecter' : 'Créer un compte'}</h1>
            <GitHubLogo />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="login-input-group">
              <label htmlFor={`${activeTab}-username`}>Nom d'utilisateur</label>
              <input
                type="text"
                id={`${activeTab}-username`}
                name="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="login-input-group">
              <label htmlFor={`${activeTab}-password`}>Mot de passe</label>
              <input
                type="password"
                id={`${activeTab}-password`}
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Patientez...' : activeTab === 'login' ? 'Se connecter' : 'Créer un compte'}
            </button>
          </form>
        </div>

        <p className="login-footer">
          Pas encore de compte GitHub ?{' '}
          <a
            href="https://github.com/signup?ref_cta=Sign+up&ref_loc=header+logged+out&ref_page=%2F&source=header-home"
            target="_blank"
            rel="noopener noreferrer"
          >
            S'inscrire
          </a>
        </p>
      </div>

      <div className="login-image">
        <img src={fondGithub} alt="fond-github" id="fond-github-image" />
      </div>
    </div>
  );
}

function GitHubLogo() {
  return (
    <svg
      id="btn-logo-home"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="white"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 
        2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 
        0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
        -.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 
        2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
        0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.11 
        0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 
        1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 
        1.91.08 2.11.51.56.82 1.27.82 2.15 0 3.07-1.87 
        3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 
        1.93-.01 2.2 0 .21.15.46.55.38A8.013 
        8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export default Login;
