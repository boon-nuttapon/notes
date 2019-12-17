'use strict';

const _ = require('lodash');
const model = require('../model');
const domain = require('../domain');

class User {
    constructor(user) {
        this._user = user;
    }

    get id() {
        return this._user.id;
    }

    expose() {
        return _.pick(this._user, [
            'id',
            'name'
        ]);
    }

    async authenticate(password) {
        if (!await this._user.verifyPassword(password)) {
            throw new domain.Error(domain.Error.Code.AUTHENTICATION_FAILED);
        }
    }

    async notebooks() {
        const notebooks = await this._user.getNotebooks({
            order: [
                ['updatedAt', 'DESC']
            ],
        });
        return _.map(notebooks, notebook => new domain.Notebook(notebook));
    }

    async notebook(id) {
        const notebooks = await this._user.getNotebooks({
            where: {
                id
            },
        });
        if (_.size(notebooks) !== 1) {
            throw new domain.Error(domain.Error.Code.NOTEBOOK_NOT_FOUND);
        }
        return new domain.Notebook(_.head(notebooks));
    }

    async createNotebook(note) {
        const createdNotebook = await this._user.createNotebook(note);
        return new domain.Notebook(createdNotebook);
    }

    static async getById(id) {
        const modelUser = await model.User.findOne({
            where: {
                id
            }
        });
        if (!modelUser) {
            throw new domain.Error(domain.Error.Code.USER_NOT_FOUND);
        }
        return new User(modelUser);
    }

    static async getByName(name) {
        const modelUser = await model.User.findOne({
            where: {
                name
            }
        });
        if (!modelUser) {
            throw new domain.Error(domain.Error.Code.USER_NOT_FOUND);
        }
        return new User(modelUser);
    }
}

module.exports = User;
