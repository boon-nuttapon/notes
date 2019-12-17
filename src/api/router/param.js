'use strict';

module.exports.noteId = async (req, noteId) => {
    req.notebook = await req.currentUser.notebook(noteId);
};
