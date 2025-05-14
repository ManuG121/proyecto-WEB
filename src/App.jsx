import { useState } from 'react'
import './App.css'
import './components/styles/styles.css'

function App() {
  const [count, setCount] = useState(0)

  const [anuncios, setAnuncios] = useState([
    { id: 1, titulo: 'Anuncio 1', descripcion: 'Descripción del anuncio 1' },
    { id: 2, titulo: 'Anuncio 2', descripcion: 'Descripción del anuncio 2' },
  ]);
  
  const [newAnuncio, setNewAnuncio] = useState({ titulo: '', descripcion: '' });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [anuncioToDelete, setAnuncioToDelete] = useState(null);
  const [user, setUser] = useState(null);
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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }
  
      const data = await response.json();
      setUser(data);
      setError('');
    } catch (err) {
      setError('Error al iniciar sesión');
    }
  };

  return (
    <>
     <div className="app-container">
        <h1>Tablero de Anuncios</h1>
        
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
      </div>
    </>
  )
}

export default App
