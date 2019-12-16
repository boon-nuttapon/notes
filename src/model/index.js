'use strict';

const Sequelize = require('sequelize');
const config = require('../config');
const sequelize = new Sequelize(config.postgresql.url, {
    logging: false
});

const User = require('./user');
const Notebook = require('./notebook');
const Note = require('./note');
const userNotebookAssociation = require('./userNotebook');
const notebookNoteAssociation = require('./notebookNote')

const models = {
    sequelize,
    User: User.define(sequelize),
    Notebook: Notebook.define(sequelize),
    Note: Note.define(sequelize),
};

userNotebookAssociation.define(models);
notebookNoteAssociation.define(models);

module.exports = models;
