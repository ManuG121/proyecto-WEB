import { useState } from 'react';
import './App.css';
import './components/styles/styles.css';

function App() {
  const [anuncios, setAnuncios] = useState([
    { id: 1, titulo: 'Venezuela Lista', descripcion: 'Maduro afirma que está listo para recoger a migrantes presos en El Salvador.', categoria: 'local' },
    { id: 2, titulo: 'Japón y el fuego artificial más grande', descripcion: 'En Japón lanzaron el fuego artificial más grande del mundo.', categoria: 'internacional' },
    { id: 3, titulo: 'URGENTE', descripcion: 'Las calles de Venezuela se desbordan para protestar contra el fraude de Nicolás Maduro.', categoria: 'local' },
  ]);

  const [newAnuncio, setNewAnuncio] = useState({ titulo: '', descripcion: '', categoria: 'local' });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [anuncioToDelete, setAnuncioToDelete] = useState(null);
  const [selectedAnuncio, setSelectedAnuncio] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser ] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState({ username: '', email: '', newPassword: '' });
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleAddAnuncio = () => {
    const nuevoAnuncio = { id: Date.now(), ...newAnuncio };
    setAnuncios([...anuncios, nuevoAnuncio]);
    setNewAnuncio({ titulo: '', descripcion: '', categoria: 'local' });
    setShowModal(false);
  };

  const handleEditAnuncio = () => {
    setAnuncios(anuncios.map(anuncio => 
      anuncio.id === selectedAnuncio.id ? { ...selectedAnuncio, ...newAnuncio } : anuncio
    ));
    setNewAnuncio({ titulo: '', descripcion: '', categoria: 'local' });
    setShowModal(false);
    setIsEditing(false);
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
      setUser (data.user);
      setProfile({ username: data.user.username, email: data.user.email, newPassword: '' });
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
    setUser (null);
    setEmail('');
    setPassword('');
  };

  const openEditModal = (anuncio) => {
    setSelectedAnuncio(anuncio);
    setNewAnuncio({ titulo: anuncio.titulo, descripcion: anuncio.descripcion, categoria: anuncio.categoria });
    setIsEditing(true);
    setShowModal(true);
  };

  const openProfileModal = () => {
    setShowProfileModal(true);
  };

  const handleUpdateProfile = () => {
    setUser ({ ...user, username: profile.username, email: profile.email });
    setShowProfileModal(false);
  };

  const filteredAnuncios = selectedCategory === 'all' ? anuncios : anuncios.filter(anuncio => anuncio.categoria === selectedCategory);

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
            <h1>PORTALE NEWS</h1>
            <p>Bienvenido, {user.username || user.email}</p>
            <button onClick={handleLogout}>Cerrar sesión</button>
            <button onClick={openProfileModal}>Ver Perfil</button>

            <div>
              <label>Filtrar por categoría:</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="all">Todos</option>
                <option value="local">Noticias Locales</option>
                <option value="internacional">Noticias Internacionales</option>
              </select>
            </div>

            <div className="anuncios-container">
              {filteredAnuncios.map(anuncio => (
                <div key={anuncio.id} className="anuncio">
                  <h3>{anuncio.titulo}</h3>
                  <p>{anuncio.descripcion}</p>
                  <p><strong>Categoría:</strong> {anuncio.categoria}</p>
                  <button onClick={() => openEditModal(anuncio)}>Editar</button>
                  <button onClick={() => { setShowDeleteModal(true); setAnuncioToDelete(anuncio.id); }}>
                    Eliminar
                  </button>
                </div>
              ))}
            </div>

            <button className="add-anuncio-button" onClick={() => {
              setNewAnuncio({ titulo: '', descripcion: '', categoria: 'local' });
              setIsEditing(false);
              setShowModal(true);
            }}>
              Agregar Anuncio
            </button>

            {showModal && (
              <div className="modal">
                <div className="modal-content">
                  <h2>{isEditing ? 'Editar Anuncio' : 'Nuevo Anuncio'}</h2>
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
                  <label>
                    Categoría:
                    <select
                      value={newAnuncio.categoria}
                      onChange={(e) => setNewAnuncio({ ...newAnuncio, categoria: e.target.value })}
                    >
                      <option value="local">Local</option>
                      <option value="internacional">Internacional</option>
                    </select>
                  </label>
                  <button onClick={isEditing ? handleEditAnuncio : handleAddAnuncio}>
                    {isEditing ? 'Actualizar' : 'Agregar'}
                  </button>
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

            {showProfileModal && (
              <div className="modal">
                <div className="modal-content">
                  <h2>Editar Perfil</h2>
                  <label>
                    Nombre de usuario:
                    <input
                      type="text"
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    />
                  </label>
                  <label>
                    Email:
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </label>
                  <label>
                    Nueva Contraseña:
                    <input
                      type="password"
                      value={profile.newPassword}
                      onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
                    />
                  </label>
                  <button onClick={handleUpdateProfile}>Actualizar Perfil</button>
                  <button onClick={() => setShowProfileModal(false)}>Cancelar</button>
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
