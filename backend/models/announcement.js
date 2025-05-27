const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Announcement = sequelize.define('Announcement', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  tableName: 'announcements',
});

module.exports = Announcement;
