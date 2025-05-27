import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Credenciales inválidas');

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError('Error al iniciar sesión');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) throw new Error('Error al registrar usuario');

      alert('Usuario registrado con éxito. Ahora puedes iniciar sesión.');
      setIsRegistering(false);
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('Error al registrarse');
    }
  };

  return (
    <div>
      <h2>{isRegistering ? 'Registrarse' : 'Iniciar sesión'}</h2>
      <form onSubmit={isRegistering ? handleRegister : handleLogin}>
        {isRegistering && (
          <div>
            <label>Usuario:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">{isRegistering ? 'Registrarse' : 'Iniciar sesión'}</button>
      </form>

      <p style={{ marginTop: '10px' }}>
        {isRegistering ? (
          <span>¿Ya tienes cuenta? <button onClick={() => setIsRegistering(false)}>Inicia sesión</button></span>
        ) : (
          <span>¿No tienes cuenta? <button onClick={() => setIsRegistering(true)}>Regístrate</button></span>
        )}
      </p>
    </div>
  );
};

export default LoginForm;