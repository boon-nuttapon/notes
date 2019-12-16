'use strict';

const Sequelize = require('sequelize');

module.exports.define = sequelize => {
    return sequelize.define('Note', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        body: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
	version: {
	    type: Sequelize.INTEGER,
	    allowNull: false,
	    validate: {
                notEmpty: true
	    }
	},
    }, {
        indexes: [
            {
                name: 'Notes_notebook_id',
                unique: true,
                fields: ['notebookId', 'id', 'version']
            },
        ],
    });
};
