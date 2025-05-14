import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Componente de ventana emergente (modal) para agregar un anuncio
const AddAnnouncementModal = ({ show, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ title, description });
    setTitle('');
    setDescription('');
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Agregar Anuncio</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Título:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Descripción:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit">Agregar</button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

// Componente de ventana emergente (modal) para confirmar eliminación de un anuncio
const DeleteConfirmationModal = ({ show, onClose, onDelete, announcementId }) => {
  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>¿Estás seguro de que deseas eliminar este anuncio?</h2>
        <button onClick={() => onDelete(announcementId)}>Sí, eliminar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Anuncio 1', description: 'Este es el primer anuncio.' },
    { id: 2, title: 'Anuncio 2', description: 'Este es el segundo anuncio.' },
    { id: 3, title: 'Anuncio 3', description: 'Este es el tercer anuncio.' }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);

  const navigate = useNavigate();

  const handleAddAnnouncement = (newAnnouncement) => {
    setAnnouncements([...announcements, { ...newAnnouncement, id: Date.now() }]);
  };

  const handleDeleteAnnouncement = (announcementId) => {
    setAnnouncements(announcements.filter((ann) => ann.id !== announcementId));
    setShowDeleteModal(false);
  };

  const handleOpenDeleteModal = (announcementId) => {
    setAnnouncementToDelete(announcementId);
    setShowDeleteModal(true);
  };

  return (
    <div>
      <h2>Tablero de Anuncios</h2>
      <button onClick={() => setShowAddModal(true)}>Agregar Anuncio</button>
      
      <div>
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div key={announcement.id} className="announcement">
              <h3>{announcement.title}</h3>
              <p>{announcement.description}</p>
              <button onClick={() => handleOpenDeleteModal(announcement.id)}>
                Eliminar
              </button>
            </div>
          ))
        ) : (
          <p>No hay anuncios disponibles.</p>
        )}
      </div>

      <AddAnnouncementModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddAnnouncement}
      />

      <DeleteConfirmationModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteAnnouncement}
        announcementId={announcementToDelete}
      />
    </div>
  );
};

export default Dashboard;