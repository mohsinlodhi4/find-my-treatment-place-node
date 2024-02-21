const mongoose = require('mongoose');

const User = new mongoose.Schema({
    name: { type: String, required: true},
    email: {type: String, required: true, unique: true, lowercase:true, },
    password: {type: String},
    status: {type: String, default: 'active'},
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required:true },

},{
    timestamps: true,
});


module.exports = mongoose.model('User', User);