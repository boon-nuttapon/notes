'use strict';

module.exports.define = models => {
    models.User.hasMany(models.Notebook, {
        foreignKey: {
            name: 'userId',
            allowNull: false
        },
        as: 'notebooks',
        onUpdate: 'RESTRICT',
        onDelete: 'CASCADE'
    });
};
