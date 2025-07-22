import React, { useEffect, useState } from 'react';
import './dashboard.css';
import { recupererProjets } from '../services/liste-projets';
import MyChartBar from './MyChartBar';
import MyChartCamembert from './MyChartCamembert';

function Dashboard() {
  const [projets, setProjets] = useState([]);
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

      let totalVues = 0;
      let totalUniques = 0;
      let totalClones = 0;
      let totalClonesUniques = 0;
      let tableauLabelProjet=[];
      let tableauQuantiteVues=[];
      let tableauQuantiteClones=[];
      let tableautop3Vues=[];
      let tableauTop3Clones=[];

      for (const projetCourant of data.repositories) {
        if (projetCourant.views) {
          totalVues += projetCourant.views.count ?? 0;
          totalUniques += projetCourant.views.uniques ?? 0;
        }

        if (projetCourant.clones) {
          totalClones += projetCourant.clones.count ?? 0;
          totalClonesUniques += projetCourant.clones.uniques ?? 0;
        }

        tableauLabelProjet.push(projetCourant.name);
        tableauQuantiteVues.push(projetCourant.views.uniques ?? 0);
        tableauQuantiteClones.push(projetCourant.clones.uniques ?? 0);


        tableautop3Vues.push({ name: projetCourant.name, y: projetCourant.views.uniques ?? 0});
        tableauTop3Clones.push({ name: projetCourant.name, y: projetCourant.clones.uniques ?? 0});
      }
      
      setNbvues(totalVues);
      setNbUniqueVisiteurs(totalUniques);
      setNbGitClones(totalClones);
      setNbGitCloneUnique(totalClonesUniques);

      setTableauLabelProjet(tableauLabelProjet);
      setTableauQuantiteVues(tableauQuantiteVues);
      setTableauQuantiteClones(tableauQuantiteClones);

      // Trier par vues uniques décroissantes
      const top3Vues = [...data.repositories]
        .sort((a, b) => (b.views?.uniques ?? 0) - (a.views?.uniques ?? 0))
        .slice(0, 3)
        .map(projet => ({
          name: projet.name,
          y: projet.views?.uniques ?? 0
        }));

      // Trier par clones uniques décroissants
      const top3Clones = [...data.repositories]
        .sort((a, b) => (b.clones?.uniques ?? 0) - (a.clones?.uniques ?? 0))
        .slice(0, 3)
        .map(projet => ({
          name: projet.name,
          y: projet.clones?.uniques ?? 0
        }));

      setTableauTop3Vues(top3Vues);
      setTableauTop3Clones(top3Clones);
                

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
            <MyChartCamembert
            data={tableauTop3Vues} 
            />
          </div>
        </div>

        <div className='dashboard-component'>
          <h1>Top 3 des projets GitHub les plus clonés</h1>
          <div className='dashboard-camembert'>
            <MyChartCamembert
            data={tableauTop3Clones}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
