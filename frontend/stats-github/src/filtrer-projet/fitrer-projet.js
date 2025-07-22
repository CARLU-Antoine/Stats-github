import React, { useEffect, useState } from 'react';
import './filtrer-projet.css';
import { recupererProjets } from '../services/liste-projets';
import DropDown from './dropdown';
import MyLineChart from './MyLineChart';

function FiltrerProjet() {
  const [projets, setProjets] = useState([]);
  const [erreur, setErreur] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [projetsSelectionnes, setProjetsSelectionnes] = useState([]);
  const [donneesGraphique, setDonneesGraphique] = useState([]);


  // Charger les projets depuis le service
  async function chargerProjets(etatRefresh) {
    try {
      const data = await recupererProjets(etatRefresh);
      setProjets(data.repositories || []);
    } catch (err) {
      setErreur(err.message || 'Erreur inconnue');
    } finally {
      setChargement(false);
    }
  }

  // Appelé au montage du composant
  useEffect(() => {
    chargerProjets(false);
  }, []);

const handleSubmit = (e) => {
  e.preventDefault();

  // On récupère les projets sélectionnés
  const projetsFiltres = projetsSelectionnes.map(nom => projets[nom]).filter(Boolean);

  // Objet pour stocker les stats par projet
  const statsParProjet = {};

  projetsFiltres.forEach(projet => {
    const nomProjet = projet.name || 'Projet inconnu';

    // Initialiser objet date -> stats pour ce projet
    const statsParDate = {};

    projet.view_stat?.forEach(({ timestamp, count }) => {
      if (!timestamp || count == null) return;
      const date = timestamp.split('T')[0];
      if (!statsParDate[date]) statsParDate[date] = { vues: 0, clones: 0 };
      statsParDate[date].vues += count;
    });

    projet.clone_stat?.forEach(({ timestamp, count }) => {
      if (!timestamp || count == null) return;
      const date = timestamp.split('T')[0];
      if (!statsParDate[date]) statsParDate[date] = { vues: 0, clones: 0 };
      statsParDate[date].clones += count;
    });

    // Transformer en tableau trié par date pour ce projet
    const donneesParDate = Object.entries(statsParDate)
      .map(([date, stats]) => ({ date, vues: stats.vues, clones: stats.clones }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    statsParProjet[nomProjet] = donneesParDate;
  });

  setDonneesGraphique(statsParProjet);
};




  return (
    <div className='container-filtrer-projet'>
      <h1>Filtrer les projets</h1>

      {erreur && <p className="erreur">{erreur}</p>}
      {chargement ? (
        <p>Chargement...</p>
      ) : (
        <>
          <form className='container-filtres' onSubmit={handleSubmit}>
            <DropDown 
              tableauLabelsProjet={Object.keys(projets)} 
              onSelectionChange={setProjetsSelectionnes}
            />
            <button className='btn-filtrer-projet' type="submit">
              Filtrer
            </button>
          </form>

          <MyLineChart data={donneesGraphique} />
        </>
      )}
    </div>
  );
}

export default FiltrerProjet;
