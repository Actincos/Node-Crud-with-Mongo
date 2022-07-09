var mongoose = require('mongoose');
var Schema = mongoose.Schema;

RoleSchema = new Schema({
    name : String,
});

module.exports = mongoose.model('Role', RoleSchema);