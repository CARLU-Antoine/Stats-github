import { Routes, Route } from 'react-router-dom';

import Navbar from './Navbar/navbar';
import ListeProjets from './liste-projets/liste-projets';
import Dashboard from './Dashboard/dashboard';
import Login from './Login/login';

function App() {
  return (
    <>
      <main>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/liste-projets" element={<ListeProjets />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
