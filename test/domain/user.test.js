'use strict';

const _ = require('lodash');
require('should');
const domain = require('../../src/domain');
const model = require('../../src/model');

describe('Tests for domain User', () => {
    let userId1;
    let noteId1;
    let userId2;

    beforeEach(async () => {
        await model.sequelize.sync({
            force: true
        });

        await Promise.all([
            (async () => {
                const user = await model.User.createUser('user1', 'password1');
                userId1 = user.id;

                const notes = await Promise.all(_.map(_.times(5, n => ({
                    subject: `subject ${ n }`,
                    body: `body ${ n }`,
                })), note => user.createNotebook(note)));
                noteId1 = _.first(notes).id;
            })(),
            (async () => {
                userId2 = (await model.User.createUser('user2', 'password2')).id;
            })(),
        ]);
    });

    describe('static method', () => {
        describe('getById', () => {
            it('should get a user by its id', async () => {
                const user = await domain.User.getById(userId1);
                user.should.be.instanceOf(domain.User);
            });

            it('should reject USER_NOT_FOUND if wrong id', async () => {
                await domain.User.getById(-1).should.be.rejectedWith(domain.Error.Code.USER_NOT_FOUND.name);
            });
        });

        describe('getByName', () => {
            it('should get a user by its name', async () => {
                const user = await domain.User.getByName('user1');
                user.should.be.instanceOf(domain.User);
            });

            it('should reject USER_NOT_FOUND if wrong name', async () => {
                await domain.User.getByName('wrong name').should.be.rejectedWith(domain.Error.Code.USER_NOT_FOUND.name);
            });
        });
    });

    describe('instance method', () => {
        let domainUser1;
        let domainUser2;

        beforeEach(async () => {
            domainUser1 = await domain.User.getById(userId1);
            domainUser2 = await domain.User.getById(userId2);
        });

        describe('getters', () => {
            it('should get the id', () => {
                domainUser1.id.should.equal(userId1);
            });
        });

        describe('expose', () => {
            it('should expose the id and the name of the user', () => {
                domainUser1.expose().should.eql({
                    id: userId1,
                    name: 'user1',
                });
            });
        });

        describe('authenticate', () => {
            it('should fulfill if correct password', async () => {
                await domainUser1.authenticate('password1').should.be.fulfilled();
            });

            it('should reject AUTHENTICATION_FAILED if wrong password', async () => {
                await domainUser1.authenticate('wrong password').should.be.rejectedWith(domain.Error.Code.AUTHENTICATION_FAILED.name);
            });
        });

        describe('notebooks', () => {
            it('should return the Notebooks asociated with the User', async () => {
                const notebooks = await domainUser1.notebooks();

                notebooks.should.have.size(5);
                _.each(notebooks, notebook => {
                    notebook.should.be.instanceOf(domain.Notebook);
                });
            });

            it('should return an empty array if no Notes', async () => {
                (await domainUser2.notebooks()).should.be.empty();
            });
        });

        describe('notebook', () => {
            it('should return a notebook by its id', async () => {
                const notebook = await domainUser1.notebook(noteId1);
                notebook.should.be.instanceOf(domain.Notebook);
            });

            it('should reject NOTEBOOK_NOT_FOUND if wrong id', async () => {
                await domainUser2.notebook(noteId1).should.be.rejectedWith(domain.Error.Code.NOTEBOOK_NOT_FOUND.name);
            });
        });

        describe('createNotebook', () => {
            it('should create a new notebook associated to the user', async () => {
                const createdNotebook = await domainUser1.createNotebook({
                    subject: 'new subject',
                    body: 'new body'
                });

                await domainUser1.notebook(createdNotebook.id).should.be.fulfilled();
            });
        });
    });
});
