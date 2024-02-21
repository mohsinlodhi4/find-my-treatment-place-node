const mongoose = require('mongoose');

const Hospital = new mongoose.Schema({
    name: { type: String, required: true},
    address: {
        longitude: {type: Number, default: 0},
        latitude: {type: Number, default: 0},
        streetAddress: {type: Number, default: ""},
        city: {type: String, default: 'Karachi'},
        country: {type: String, default: 'Pakistan'},
    },
},{
    timestamps: true,
});


module.exports = mongoose.model('Hospital', Hospital);