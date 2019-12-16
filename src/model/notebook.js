'use strict';

const Sequelize = require('sequelize');

module.exports.define = sequelize => {
	return sequelize.define('Notebook', {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		subject: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		lastVersion: {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 0,
			validate: {
				notEmpty: true
			}
		},
	}, {
		indexes: [
			{
				name: 'Notebooks_user_id',
				unique: true,
				fields: ['userId', 'id']
			},
		],
	});
};
