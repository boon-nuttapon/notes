'use strict';

const _ = require('lodash');
const model = require('../model');
const domain = require('../domain');

class Notebook {
	constructor(notebook) {
		this._notebook = notebook;
	}

	get id() {
		return this._notebook.id;
	}

	expose() {
		return _.pick(this._notebook, [
			'id',
			'subject',
			'lastVersion',
			'updatedAt',
		]);
	}

	async notes() {
		const notes = await this._notebook.getNotes({
			order: [
				['version', 'ASC']
			],
		});
		return _.map(notes, note => new domain.Note(note));
	}

	async note(id) {
		const notes = await this._notebook.getNotes({
			where: {
				id
			},
		});
		if (_.size(notes) !== 1) {
			throw new domain.Error(domain.Error.Code.NOTE_NOT_FOUND);
		}
		return new domain.Note(_.head(notes));
	}

	async updateLastVersion() {
		const updatedVersion = this._notebook.lastVersion + 1;
		await this._notebook.update({
			lastVersion: updatedVersion
		});
	}

	async updateNote(note) {
		note.version = this._notebook.lastVersion;
		const updatedNote = await this._notebook.createNote(note);
		return new domain.Note(updatedNote);
	}

	getLastVersion() {
		return this._notebook.lastVersion;
	}

	async delete() {
		await this._notebook.destroy();
	}
}

module.exports = Notebook;
