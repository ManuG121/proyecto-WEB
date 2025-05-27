import React, { useState, useEffect } from 'react';

const Dashboard = ({ user, handleLogout }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [category, setCategory] = useState('Todas');
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    fetch('http://localhost:3000/announcements', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAnnouncements(data))
      .catch((err) => console.error(err));
  }, [token]);

  // Filtrar anuncios según categoría
  useEffect(() => {
    if (category === 'Todas') {
      setFilteredAnnouncements(announcements);
    } else {
      setFilteredAnnouncements(
        announcements.filter((a) =>
          a.category && a.category.toLowerCase() === category.toLowerCase()
        )
      );
    }
  }, [category, announcements]);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/announcements/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Portale</h1>
        <div className="user-info">
          <span>{user?.username || user?.email}</span>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </header>

      <section className="category-filter">
        <label>Filtrar por categoría: </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Todas">Todas</option>
          <option value="Noticias">Noticias</option>
          <option value="Ventas">Ventas</option>
          <option value="Eventos">Eventos</option>
          {/* Añade aquí más categorías si quieres */}
        </select>
      </section>

      <section className="announcements-list">
        {filteredAnnouncements.length === 0 ? (
          <p>No hay anuncios para esta categoría.</p>
        ) : (
          filteredAnnouncements.map((a) => (
            <div key={a.id} className="anuncio">
              <h3>{a.title || a.titulo}</h3>
              <p>{a.description || a.descripcion}</p>
              <button onClick={() => handleDelete(a.id)}>Eliminar</button>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Dashboard;
