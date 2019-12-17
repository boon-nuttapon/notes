'use strict';

const _ = require('lodash');

class Note {
    constructor(note) {
        this._note = note;
    }

    get id() {
        return this._note.id;
    }

    expose() {
        return _.pick(this._note, [
            'id',
            'body',
	    'version',
            'updatedAt',
        ]);
    }

    version() {
    	return this._note.version;
    }

    async delete() {
        await this._note.destroy();
    }
}

module.exports = Note;
