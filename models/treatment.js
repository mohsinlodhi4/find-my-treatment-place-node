const mongoose = require('mongoose');

const Treatment = new mongoose.Schema({
    name: { type: String, required: true},
    aliases: { type: Array }, // for search
    category: { type: mongoose.Types.ObjectId, ref: 'TreatmentCategory'},
    hospital: { type: mongoose.Types.ObjectId, ref: 'Hospital'},
    cost: { type: Number, },
},{
    timestamps: true,
});


module.exports = mongoose.model('Treatment', Treatment);