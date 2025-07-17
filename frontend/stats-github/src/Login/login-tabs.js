import React from 'react';
import './login-tabs.css';

function LoginTabs({ activeTab, setActiveTab }) {
  return (
    <div className="tab-container-login">
      <button
        className={activeTab === 'login' ? 'actif' : ''}
        onClick={() => setActiveTab('login')}
      >
        Se connecter
      </button>
      <button
        className={activeTab === 'register' ? 'actif' : ''}
        onClick={() => setActiveTab('register')}
      >
        Créer un compte
      </button>
    </div>
  );
}

export default LoginTabs;
