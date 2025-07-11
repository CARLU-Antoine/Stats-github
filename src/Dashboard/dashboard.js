import './dashboard.css'; 
import MyChart from './chart';

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
                    <MyChart />
                </div>
            </div>
        </div>
    </div>
  );
}


export default Dashboard;
