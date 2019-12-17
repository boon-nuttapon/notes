'use strict';

const _ = require('lodash');
require('should');
const domain = require('../../src/domain');
const model = require('../../src/model');

describe('Tests for domain Note', () => {
    let noteId;
    let modelUser;
    let domainNotebook;
    let domainNote;

    beforeEach(async () => {
        await model.sequelize.sync({
            force: true
        });

        modelUser = await model.User.createUser('user1', 'password1');

        const notebook = await modelUser.createNotebook({
            subject: 'some subject',
            body: 'some body',
        });
        domainNotebook = new domain.Notebook(notebook);

	await domainNotebook.updateLastVersion();

	await domainNotebook.updateNote({
		body: 'new body'
	});
	
	await domainNotebook.updateLastVersion();

	domainNote = await domainNotebook.updateNote({
		body: 'newer body'
	});
    });

    describe('instance method', () => {
        describe('getters', () => {
            it('should get the id', () => {
                domainNote.id.should.equal(2);
            });
        });

        describe('expose', () => {
            it('should expose the id, body, version and updatedAt of the note', () => {
                domainNote.expose().should.match({
                    id: 2,
                    body: 'newer body',
                    version: 2,
                    updatedAt: _.isDate,
                });
            });
        });

        /*describe('delete', () => {
            it('should delete the note', async () => {
                await domainNote.delete();

                (await domainNotebook.notes()).should.be.empty();
            });
        });*/
    });
});
