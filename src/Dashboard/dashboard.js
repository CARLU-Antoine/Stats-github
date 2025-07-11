import './dashboard.css'; 
import MyChartBar from './MyChartBar';
import MyChartCamembert from './MyChartCamembert';

function Dashboard() {
  return (
    <div className="dashboard">
        <div className="dashboard-row">
            <div className='dashboard-component'>
                <h1>Statistiques des projets GitHub</h1>

                <div className='dashboard-cards-stats'>
                    <div className='dashboard-card-stats'>
                        <h2>Nombre de vues</h2>
                        <p>150</p>
                    </div>

                    <div className='dashboard-card-stats'>
                        <h2>Unique visiteurs</h2>
                        <p>150</p>
                    </div>

                    <div className='dashboard-card-stats'>
                        <h2>Nombre de git clone</h2>
                        <p>150</p>
                    </div>
                    <div className='dashboard-card-stats'>
                        <h2>Nombre de git clone unique</h2>
                        <p>150</p>
                    </div>
                </div>
            </div>
            <div className='dashboard-component'>
                <h1>Statistiques en barre des projets GitHub</h1>
                <div className='dashboard-bar'>
                    <MyChartBar />
                </div>
            </div>
        </div>
         <div className="dashboard-row">
            <div className='dashboard-component'>
                <h1>Top 3 des projets GitHub les plus visités</h1>
                <div className='dashboard-camembert'>
                    <MyChartCamembert />
                </div>
            </div>
            <div className='dashboard-component'>
                <h1>Top 3 des projets GitHub les plus clonés</h1>
                <div className='dashboard-camembert'>
                    <MyChartCamembert />
                </div>
            </div>

        </div>
        
    </div>
  );
}


export default Dashboard;
