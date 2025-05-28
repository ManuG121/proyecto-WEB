import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalAnnouncement, setModalAnnouncement] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:3000/announcements', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAnnouncements(data))
      .catch((err) => console.error(err));
  }, [token, navigate]);

  const handleAdd = async () => {
    const response = await fetch('http://localhost:3000/announcements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    const newItem = await response.json();
    setAnnouncements([...announcements, newItem]);
    setTitle('');
    setDescription('');
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/announcements/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const openModal = (announcement) => {
    setModalAnnouncement(announcement);
    setShowModal(true);
  };

  const closeModal = () => {
    setModalAnnouncement(null);
    setShowModal(false);
  };

  return (
    <div className="app-container">
      <header className="dashboard-header">
        <h1>Portale News</h1>
        <div className="user-info">
          <span>{user?.username || user?.email}</span>
          <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </header>

      <h2>Tablero de Anuncios</h2>

      {announcements.map((a) => (
        <div 
          key={a.id} 
          className="anuncio" 
          style={{ cursor: 'pointer' }}
          onClick={() => openModal(a)}
          >
          <h3>{a.title}</h3>
          <p>{a.description.length > 100 ? a.description.substring(0, 100) + "..." : a.description}</p>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(a.id); }}>Eliminar</button>
        </div>
      ))}

      <h3>Agregar nuevo anuncio</h3>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" />
      <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción" />
      <button onClick={handleAdd}>Agregar</button>

      {showModal && modalAnnouncement && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{modalAnnouncement.title}</h2>
            <p>{modalAnnouncement.description}</p>
            <button onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;