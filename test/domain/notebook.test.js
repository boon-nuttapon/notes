'use strict';

const _ = require('lodash');
require('should');
const domain = require('../../src/domain');
const model = require('../../src/model');

describe('Tests for domain Notebook', () => {
    let notebookId;
    let modelUser;
    let domainNotebook;
    let domainNote;
    let noteId;

    beforeEach(async () => {
        await model.sequelize.sync({
            force: true
        });

        modelUser = await model.User.createUser('user1', 'password1');

        const notebook = await modelUser.createNotebook({
            subject: 'some subject',
        });
        notebookId = notebook.id;
        domainNotebook = new domain.Notebook(notebook);

	await domainNotebook.updateLastVersion();

	await domainNotebook.updateNote({ 
		body: 'new body' 
	});

	await domainNotebook.updateLastVersion();
	
	await domainNotebook.updateNote({
		body: 'newer body'
	});
    });

    describe('instance method', () => {
        describe('getters', () => {
            it('should get the id', () => {
                domainNotebook.id.should.equal(notebookId);
            });

	    it('should get latest version', async () => {
		domainNotebook.getLastVersion().should.equal(2);
	    });
	});

	describe('note', () => {
	    it('should get notes associate with notebook', async () => {
	    	const notes = await domainNotebook.notes();
		notes.should.have.size(2);
		_.each(notes, note => {
			note.should.be.instanceOf(domain.Note);
		});
	    });

	    it('should get note by id', async () => {
	    	const note = await domainNotebook.note(2);
		note.should.be.instanceOf(domain.Note);
	    });
        });

        describe('expose', () => {
            it('should expose the id, subject, lastVersion and updatedAt of the note', () => {
                domainNotebook.expose().should.match({
                    id: notebookId,
                    subject: 'some subject',
                    lastVersion: 2,
                    updatedAt: _.isDate,
                });
            });
        });

        describe('update', () => {
            it('should add new version of the note', async () => {
           	await domainNotebook.updateLastVersion();

		domainNote = await domainNotebook.updateNote({
                    body: 'newest body'
                });

                domainNote.expose().should.match({
                    id: 3,
                    body: 'newest body',
		    version: 3,
                    updatedAt: _.isDate,
                });
            });
	});

        describe('delete', () => {
            it('should delete the notebook', async () => {
                await domainNotebook.delete();

                (await modelUser.getNotebooks()).should.be.empty();
            });
        });
    });
});
