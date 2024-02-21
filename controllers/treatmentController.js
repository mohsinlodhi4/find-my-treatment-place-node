const User = require('../models/user');
const Treatment = require('../models/treatment');
const TreatmentCategory = require('../models/treatmentCategory');
const {successResponse, errorResponse} = require('../utils/functions');

const searchTreatments = async (req, res) => {
    try {
        const { searchQuery, longitude, latitude } = req.query;
        
        // Search for treatments by name
        const treatmentsByName = await Treatment.find({
            $or: [
                { name: new RegExp(searchQuery, 'i') }, // Case-insensitive search
                { aliases: { $in: [new RegExp(searchQuery, 'i')] } } // Match any word in the aliases array
            ]
        }).populate('category').populate('hospital');

        // Search for treatments by category name
        const categories = await TreatmentCategory.find({ name: new RegExp(searchQuery, 'i') });
        let treatmentsByCategories = [];
        let foundTreatmentIds = treatmentsByName.map(el=>el._id);
        for(let category of categories) {
            treatmentsByCategories = [
                ...treatmentsByCategories,
                ...(await Treatment.find({ _id: {$nin: foundTreatmentIds},category: category._id }).populate('category').populate('hospital')),
            ]
        }

        // Combine results
        let treatments = [...treatmentsByName, ...treatmentsByCategories];

        if(longitude && latitude) {
            const treatmentsWithDistance = treatmentsByName.map((treatment) => {
                const hospital = treatment.hospital;
                const distance = calculateDistance(parseFloat(latitude), parseFloat(longitude), hospital.address.latitude, hospital.address.longitude);
                return { treatment, distance };
            })
            treatmentsWithDistance.sort((a, b) => a.distance - b.distance);
            treatments = treatmentsWithDistance.map(obj => obj.treatment)
        }

        return res.status(200).json(successResponse('Treatments found.', { treatments }));
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorResponse('Internal server error.'));
    }
}
const getSuggestions = async (req, res) => {
    try {
        const { searchQuery } = req.query;

        // Search for treatments matching the query
        const treatments = await Treatment.find({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search for treatment names
                { aliases: { $in: [new RegExp(searchQuery, 'i')] } } // Match any word in the aliases array
            ]
        }).distinct('name'); // Get distinct treatment names

        // Search for treatment categories matching the query
        const categories = await TreatmentCategory.find({
            name: { $regex: searchQuery, $options: 'i' } // Case-insensitive search for category names
        }).distinct('name'); // Get distinct category names

        // Combine and format the suggestions as text
        const suggestions = [...treatments, ...categories].map(item => item.name);

        return res.status(200).json(successResponse('Search suggestions found.', { suggestions }));
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorResponse('Internal server error.'));
    }
}
const treatmentsByCategory = async (req, res) => {
    try {
        const { longitude, latitude } = req.query;
        
        // Search for treatments by name
        let treatments = await Treatment.find({
            category: req.params.id
        }).populate('category').populate('hospital');

        if(longitude && latitude) {
            const treatmentsWithDistance = treatmentsByName.map((treatment) => {
                const hospital = treatment.hospital;
                const distance = calculateDistance(parseFloat(latitude), parseFloat(longitude), hospital.address.latitude, hospital.address.longitude);
                return { treatment, distance };
            })
            treatmentsWithDistance.sort((a, b) => a.distance - b.distance);
            treatments = treatmentsWithDistance.map(obj => obj.treatment)
        }

        return res.status(200).json(successResponse('Treatments found.', { treatments }));
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorResponse('Internal server error.'));
    }
}

const getSingleTreatment = async (req, res) => {
    try {
        // Search for treatments by name
        let treatment = await Treatment.findOne({
            _id: req.params.id
        }).populate('category').populate('hospital');

        return res.status(200).json(successResponse('Treatment found.', { treatment }));
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorResponse('Internal server error.'));
    }
}
const getCategories = async (req, res) => {
    try {
        // Search for treatments by name
        let categories = await TreatmentCategory.find()

        return res.status(200).json(successResponse('Categories found.', { categories }));
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorResponse('Internal server error.'));
    }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

module.exports = {
    searchTreatments,
    treatmentsByCategory,
    getSingleTreatment,
    getCategories,
    getSuggestions,
}