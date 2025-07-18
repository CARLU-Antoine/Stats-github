import React, { useEffect, useState } from 'react';
import { recupererProjets } from '../services/liste-projets';
import './liste-projets.css'

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
      <div className='cards-projets-container'>
        {projets.map(projet => (
          <div className='card-projet' key={projet.id || projet.name}>
            <h3>{projet.name}</h3>
            <button
              className='btn-link-projet'
              onClick={() => window.open(projet.html_url, '_blank', 'noopener,noreferrer')}
            >
              Voir le projet
            </button>
            <p>{projet.description || 'Pas de description'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListeProjets;
