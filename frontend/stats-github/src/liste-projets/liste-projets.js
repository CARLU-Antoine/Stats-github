import React, { useEffect, useState } from 'react';
import { recupererProjets } from '../services/liste-projets';

function ListeProjets() {
  const [projets, setProjets] = useState([]);
  const [erreur, setErreur] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    async function chargerProjets() {
      try {
        const data = await recupererProjets();
        setProjets(data.repositories || []);
      } catch (err) {
        setErreur(err.message);
      } finally {
        setChargement(false);
      }
    }

    chargerProjets();
  }, []);

  if (chargement) return <p>Chargement...</p>;
  if (erreur) return <p>Erreur : {erreur}</p>;

  return (
    <div>
      <h1>Liste des projets GitHub</h1>
      <ul>
        {projets.map(projet => (
          <li key={projet.full_name}>
            <a href={projet.html_url} target="_blank" rel="noopener noreferrer">
              {projet.name}
            </a>
            <p>{projet.description || 'Pas de description'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListeProjets;
