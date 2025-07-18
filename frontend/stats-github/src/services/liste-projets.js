const API_BASE_URL = 'http://localhost:8000/api';


export async function recupererProjets() {
  const response = await fetch(`${API_BASE_URL}/connect/github`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  // si tu as besoin d’envoyer les cookies de session
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erreur lors de la récupération de la liste des projets');
  }

  return await response.json();
}
