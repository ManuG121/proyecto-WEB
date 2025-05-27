import { useState } from 'react';
import './App.css';
import './components/styles/styles.css';

function App() {
  const [anuncios, setAnuncios] = useState([
    { id: 1, titulo: 'Venezuela Lista', descripcion: 'Maduro afirma que está listo para recoger a migrantes presos en El Salvador.' },
    { id: 2, titulo: 'Mundo Gamer existencias', descripcion: 'PS5 Slim usado por solo $1.750.000' },
    { id: 3, titulo: 'Mundo Gamer existencias', descripcion: 'PS5 Slim nuevo + control dualsense adicional + diadema + juego de obsequio por solo $2.200.000' },
  ]);

  const [newAnuncio, setNewAnuncio] = useState({ titulo: '', descripcion: '' });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [anuncioToDelete, setAnuncioToDelete] = useState(null);

  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAddAnuncio = () => {
    const nuevoAnuncio = { id: Date.now(), ...newAnuncio };
    setAnuncios([...anuncios, nuevoAnuncio]);
    setNewAnuncio({ titulo: '', descripcion: '' });
    setShowModal(false);
  };

  const handleDeleteAnuncio = () => {
    setAnuncios(anuncios.filter(anuncio => anuncio.id !== anuncioToDelete));
    setShowDeleteModal(false);
  };

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
      setUser(data.user);
      setError('');
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

      if (!response.ok) throw new Error('Registro fallido');

      alert('Usuario registrado con éxito. Ahora puedes iniciar sesión.');
      setIsRegistering(false);
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('Error al registrarse');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmail('');
    setPassword('');
  };

  return (
    <>
      <div className="app-container">
        {!user ? (
          <div className="login-form">
            <h2>{isRegistering ? 'Registrarse' : 'Iniciar sesión'}</h2>
            <form onSubmit={isRegistering ? handleRegister : handleLogin}>
              {isRegistering && (
                <div>
                  <label>Nombre de usuario:</label>
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
        ) : (
          <>
            <h1>Tablero de Anuncios</h1>
            <p>Bienvenido, {user.username || user.email}</p>
            <button onClick={handleLogout}>Cerrar sesión</button>

            <div className="anuncios-container">
              {anuncios.map(anuncio => (
                <div key={anuncio.id} className="anuncio">
                  <h3>{anuncio.titulo}</h3>
                  <p>{anuncio.descripcion}</p>
                  <button onClick={() => { setShowDeleteModal(true); setAnuncioToDelete(anuncio.id); }}>
                    Eliminar
                  </button>
                </div>
              ))}
            </div>

            <button className="add-anuncio-button" onClick={() => setShowModal(true)}>
              Agregar Anuncio
            </button>

            {showModal && (
              <div className="modal">
                <div className="modal-content">
                  <h2>Nuevo Anuncio</h2>
                  <label>
                    Título:
                    <input
                      type="text"
                      value={newAnuncio.titulo}
                      onChange={(e) => setNewAnuncio({ ...newAnuncio, titulo: e.target.value })}
                    />
                  </label>
                  <label>
                    Descripción:
                    <input
                      type="text"
                      value={newAnuncio.descripcion}
                      onChange={(e) => setNewAnuncio({ ...newAnuncio, descripcion: e.target.value })}
                    />
                  </label>
                  <button onClick={handleAddAnuncio}>Agregar</button>
                  <button onClick={() => setShowModal(false)}>Cancelar</button>
                </div>
              </div>
            )}

            {showDeleteModal && (
              <div className="modal">
                <div className="modal-content">
                  <h2>¿Estás seguro de eliminar este anuncio?</h2>
                  <button onClick={handleDeleteAnuncio}>Sí, eliminar</button>
                  <button onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default App;
