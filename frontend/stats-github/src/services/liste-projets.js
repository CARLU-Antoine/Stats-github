const API_BASE_URL = 'http://localhost:8000/api';


export async function recupererProjets() {
  const response = await fetch(`${API_BASE_URL}/github/repos`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erreur lors de la récupération des projets GitHub');
  }

  return await response.json();
}