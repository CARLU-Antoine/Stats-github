import React, { useEffect, useState } from 'react';
import { recupererProjets } from '../services/liste-projets';
import './liste-projets.css';

function ListeProjets() {
  const [projets, setProjets] = useState([]);
  const [erreur, setErreur] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [isRotating, setIsRotating] = useState(false);

  const handleClick = async () => {
    setIsRotating(true);
    setChargement(true);
    setErreur(null);
    setProjets([]);

    await chargerProjets(true);

    setTimeout(() => {
      setIsRotating(false);
    }, 1000);
  };

  async function chargerProjets(etatRefresh) {
    try {
      const data = await recupererProjets(etatRefresh);

      console.log('data',data.repositories)
      
      setProjets(data.repositories || []);
    } catch (err) {
      setErreur(err.message || 'Erreur inconnue');
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => {
    chargerProjets(false);
  }, []);

  if (chargement) return <p>Chargement...</p>;
  if (erreur) return <p>Erreur : {erreur}</p>;

  return (
    <div className='container-composant-liste-projets'>
      <div className='container-header-liste-projets'>
        <h1>Liste des projets GitHub</h1>
        <svg
          className={`btn-refresh-liste-projets ${isRotating ? 'rotate' : ''}`}
          onClick={handleClick}
          xmlns="http://www.w3.org/2000/svg"
          width="24" height="24" fill="white"
          viewBox="0 0 512 512"
        >
          <path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160 352 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l111.5 0c0 0 0 0 0 0l.4 0c17.7 0 32-14.3 32-32l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1L16 432c0 17.7 14.3 32 32 32s32-14.3 32-32l0-35.1 17.6 17.5c0 0 0 0 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.8c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352l34.4 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L48.4 288c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"/>
        </svg>
      </div>

      <div className='cards-projets-container'>
        {projets.map(projet => (
          <div className='card-projet' key={projet.id || projet.name}>
            <div className='card-header-projet'>
                <h4>{projet.name} créé par {projet.owner}</h4>
                
                <div>
                  <div className='card-vues-projet'>
                     <p>{projet.views?.count ? projet.views.uniques : '0'} vues</p>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="white" width="20" height="20"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>
                  </div>
                  <div className='card-vues-projet'>
                    <p>{projet?.clones ? projet.clones.uniques : '0'} clones</p>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="white" width="20" height="20"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>
                  </div>
                </div>
                
            </div>

            <h4>
            {projet.created_at
              ? new Date(projet.created_at).toLocaleString("fr-FR", {
                  timeZone: "Europe/Paris",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              : 'Pas de date de création'}
          </h4>

            <h5>{projet.language || 'Pas de langage'}</h5>


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
