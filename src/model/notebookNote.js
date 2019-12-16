'use strict';

module.exports.define = models => {
    models.Notebook.hasMany(models.Note, {
        foreignKey: {
            name: 'notebookId',
            allowNull: false
        },
        as: 'notes',
        onUpdate: 'RESTRICT',
        onDelete: 'CASCADE'
    });
};
