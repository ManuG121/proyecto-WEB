import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

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

  return (
    <div>
      <h2>Tablero de Anuncios</h2>
      <button onClick={handleLogout}>Cerrar sesión</button>

      {announcements.map((a) => (
        <div key={a.id}>
          <h3>{a.title}</h3>
          <p>{a.description}</p>
          <button onClick={() => handleDelete(a.id)}>Eliminar</button>
        </div>
      ))}

      <h3>Agregar nuevo anuncio</h3>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" />
      <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción" />
      <button onClick={handleAdd}>Agregar</button>
    </div>
  );
};

export default Dashboard;