const mongoose = require('mongoose');

const TreatmentCategory = new mongoose.Schema({
    name: { type: String, required: true},
    aliases: { type: Array },
},{
    timestamps: true,
});


module.exports = mongoose.model('TreatmentCategory', TreatmentCategory);