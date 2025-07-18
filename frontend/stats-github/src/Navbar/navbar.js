import { NavLink } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './navbar.css';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUsername = localStorage.getItem('username');
    setIsAuthenticated(!!token);
    setUsername(storedUsername || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername('');
  };

  return (
    <nav className="navbar">
      <div className="navbar-header">
        <h1 className="navbar-title">GitHub</h1>
        <svg
          id="btn-logo-home"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="white"
          width="32"
          height="32"
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
      </div>

      <ul className="navbar-links">
        {isAuthenticated ? (
          <>
            <li className="navbar-item">
              Bienvenue, {username}
            </li>
            <li onClick={handleLogout}>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? 'navbar-item actif' : 'navbar-item'
                }
              >
                Déconnexion
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/liste-projets"
                className={({ isActive }) =>
                  isActive ? 'navbar-item actif' : 'navbar-item'
                }
              >
                Projets
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? 'navbar-item actif' : 'navbar-item'
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/filtrer-projets"
                className={({ isActive }) =>
                  isActive ? 'navbar-item actif' : 'navbar-item'
                }
              >
                Filtrer par projet
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? 'navbar-item actif' : 'navbar-item'
              }
            >
              Se connecter
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
