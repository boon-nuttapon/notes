'use strict';

const _ = require('lodash');

module.exports.create = async (req, res) => {
    const notebook = await req.currentUser.createNotebook(req.body);
    await notebook.updateLastVersion();
    await notebook.updateNote(req.body);
    res.json(notebook.expose());
};

module.exports.list = async (req, res) => {
    const notebooks = await req.currentUser.notebooks();
    res.json(_.invokeMap(notebooks, 'expose'));
};

module.exports.get = async (req, res) => {
    const notebookDetails = req.notebook.expose();
    const notes = req.notebook.notes();
    _.each(notes, note => {
    	notebookDetails.note[note.version()] = note.expose();
    });
    res.json(notebookDetails);
};

module.exports.update = async (req, res) => {
    await req.notebook.updateLastVersion();
    await req.notebook.updateNote(req.body);
    res.json(req.notebook.expose());
};

module.exports.delete = async (req, res) => {
    await req.notebook.delete();
    res.sendStatus(204);
};
