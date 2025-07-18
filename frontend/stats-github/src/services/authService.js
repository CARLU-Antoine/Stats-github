const API_BASE_URL = 'http://localhost:8000/api';

export async function connexion(username, password) {
  const response = await fetch(`${API_BASE_URL}/connexion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erreur lors de la connexion');
  }

  return await response.json();
}

export async function creerCompte(username, password) {
  const response = await fetch(`${API_BASE_URL}/creer-compte`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erreur lors de la création du compte');
  }

  return await response.json();
}