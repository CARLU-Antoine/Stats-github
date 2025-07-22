import React, { useEffect, useState } from 'react';
import './dashboard.css';
import { recupererProjets } from '../services/liste-projets';
import MyChartBar from './MyChartBar';
import MyChartCamembert from './MyChartCamembert';

function Dashboard() {
  const [erreur, setErreur] = useState(null);
  const [chargement, setChargement] = useState(true);

  const [nbvues, setNbvues] = useState(0);
  const [nbUniqueVisiteurs, setNbUniqueVisiteurs] = useState(0);
  const [nbGitClones, setNbGitClones] = useState(0);
  const [nbGitCloneUnique, setNbGitCloneUnique] = useState(0);

  const [tableauLabelProjet, setTableauLabelProjet] = useState([]);
  const [tableauQuantiteVues, setTableauQuantiteVues] = useState([]);
  const [tableauQuantiteClones, setTableauQuantiteClones] = useState([]);
  
  const [tableauTop3Vues, setTableauTop3Vues] = useState([]);
  const [tableauTop3Clones, setTableauTop3Clones] = useState([]);

  async function chargerProjets(etatRefresh) {
    try {
      const data = await recupererProjets(etatRefresh);

      const projets = Object.values(data.repositories || {});

      let totalVues = 0;
      let totalUniques = 0;
      let totalClones = 0;
      let totalClonesUniques = 0;
      let labels = [];
      let vues = [];
      let clones = [];

      projets.forEach(projet => {
        const vuesProjet = projet.views?.uniques ?? 0;
        const clonesProjet = projet.clones?.uniques ?? 0;

        totalVues += projet.views?.count ?? 0;
        totalUniques += vuesProjet;
        totalClones += projet.clones?.count ?? 0;
        totalClonesUniques += clonesProjet;

        labels.push(projet.name);
        vues.push(vuesProjet);
        clones.push(clonesProjet);
      });

      setNbvues(totalVues);
      setNbUniqueVisiteurs(totalUniques);
      setNbGitClones(totalClones);
      setNbGitCloneUnique(totalClonesUniques);

      setTableauLabelProjet(labels);
      setTableauQuantiteVues(vues);
      setTableauQuantiteClones(clones);

      // Top 3 vues
      const top3Vues = projets
        .sort((a, b) => (b.views?.uniques ?? 0) - (a.views?.uniques ?? 0))
        .slice(0, 3)
        .map(projet => ({
          name: projet.name,
          y: projet.views?.uniques ?? 0
        }));

      // Top 3 clones
      const top3Clones = projets
        .sort((a, b) => (b.clones?.uniques ?? 0) - (a.clones?.uniques ?? 0))
        .slice(0, 3)
        .map(projet => ({
          name: projet.name,
          y: projet.clones?.uniques ?? 0
        }));

      setTableauTop3Vues(top3Vues);
      setTableauTop3Clones(top3Clones);

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
    <div className="dashboard">
      <div className="dashboard-row">
        <div className='dashboard-component'>
          <h1>Statistiques des projets GitHub</h1>

          <div className='dashboard-cards-stats'>
            <div className='dashboard-card-stats'>
              <h2>Nombre de vues</h2>
              <p>{nbvues}</p>
            </div>

            <div className='dashboard-card-stats'>
              <h2>Unique visiteurs</h2>
              <p>{nbUniqueVisiteurs}</p>
            </div>

            <div className='dashboard-card-stats'>
              <h2>Nombre de git clone</h2>
              <p>{nbGitClones}</p>
            </div>

            <div className='dashboard-card-stats'>
              <h2>Nombre de git clone unique</h2>
              <p>{nbGitCloneUnique}</p>
            </div>
          </div>
        </div>

        <div className='dashboard-component'>
          <h1>Statistiques en barre des projets GitHub</h1>
          <div className='dashboard-bar'>
            <MyChartBar
              tableauLabelProjet={tableauLabelProjet}
              tableauQuantiteVues={tableauQuantiteVues}
              tableauQuantiteClones={tableauQuantiteClones}
            />
          </div>
        </div>
      </div>

      <div className="dashboard-row">
        <div className='dashboard-component'>
          <h1>Top 3 des projets GitHub les plus visités</h1>
          <div className='dashboard-camembert'>
            <MyChartCamembert data={tableauTop3Vues} />
          </div>
        </div>

        <div className='dashboard-component'>
          <h1>Top 3 des projets GitHub les plus clonés</h1>
          <div className='dashboard-camembert'>
            <MyChartCamembert data={tableauTop3Clones} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
