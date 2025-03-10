import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import Navegacion from './components/Navegacion';
import CrearUsuarios from './components/CrearUsuario';
import ListaUsuarios from './components/ListaUsuarios';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function App() {
  const isAuthenticated = !!localStorage.getItem('token'); // Verifica si hay un token

  return (
    <div className=''>
      {isAuthenticated && <Navegacion />}
      <div className='container p-4'>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/' element={isAuthenticated ? <ListaUsuarios /> : <Navigate to="/login" />} />
          <Route path='/CrearUsuario' element={isAuthenticated ? <CrearUsuarios /> : <Navigate to="/login" />} />
          <Route path='/edit/:id' element={isAuthenticated ? <CrearUsuarios /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
