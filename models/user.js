var mongoose = require('mongoose');
var Schema = mongoose.Schema;

UserSchema = new Schema({
    name : String,
    email : String,
	password : String,
    roles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Role'
        }
    ]
});

module.exports = mongoose.model('User', UserSchema);