'use strict';

const _ = require('lodash');


function validateNoteUpdateParams(params) {
    var valid = true;

    // ToDo: Add other validate details

    // Do not allow subject param 
    valid = valid && !('subject' in params);

    return valid;
}

module.exports = {
    validateNoteUpdateParams,
}
