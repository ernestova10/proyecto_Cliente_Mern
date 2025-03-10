import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('https://proyecto-cliente-mern.onrender.com/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password })
    });

    const data = await res.json();
    
    if (res.ok) {
      localStorage.setItem('token', data.token); // Guardar el token en el localStorage
      navigate('/'); // Redirigir a la página principal
    } else {
      alert(data.mensaje);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Correo:</label>
          <input type="email" className="form-control" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña:</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Ingresar</button>
      </form>
    </div>
  );
}

export default Login;
