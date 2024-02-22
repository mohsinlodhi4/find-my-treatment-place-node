const fs = require('fs');
const path = require('path')
const csv = require('csv-parser');
const Treatment = require('../../models/treatment');
const TreatmentCategory = require('../../models/treatmentCategory');
const Hospital = require('../../models/hospital');
const connectDB = require('../connection');
require('dotenv').config();

async function seedData() {
    
  try {
    await connectDB();
    const treatments = [];
    const categories = new Set();
    const hospitals = new Set();

    fs.createReadStream(path.resolve(__dirname, './data/treatment-data.csv'))
    //   .pipe(csv({ skipLines: 1 })) // Skip header line
      .pipe(csv())
      .on('data', (row) => {
        console.log("row", row);
        const {
          Treatment: treatment,
          Cost,
          Category: category,
          Hostipital: hospital,
          Latitude,
          Longitude,
        } = row;

        // Remove leading/trailing spaces and parse Cost as float
        const cleanCost = parseFloat(Cost.replace(',', ''));

        // Remove leading/trailing spaces and parse Longitude and Latitude as float
        const cleanLongitude = parseFloat(Longitude.trim());
        const cleanLatitude = parseFloat(Latitude.trim());

        // Create treatment category
        categories.add(category.trim());

        // Create hospital
        hospitals.add({
          name: hospital.trim(),
          address: {
              longitude: cleanLongitude,
              latitude: cleanLatitude,
          }
        });

        // Add treatment
        treatments.push({
          name: treatment.trim(),
          cost: cleanCost,
          category: category.trim(),
          hospital: hospital.trim(),
          address: {
            longitude: cleanLongitude,
            latitude: cleanLatitude,
          },
        });
      })
      .on('end', async () => {
        // Seed treatment categories
        await TreatmentCategory.insertMany([...categories].map((name) => ({ name })));

        // Seed hospitals
        await Hospital.insertMany([...hospitals]);

        // Get treatment category and hospital IDs
        const categoryMap = new Map();
        const categoryDocs = await TreatmentCategory.find();
        categoryDocs.forEach((category) => {
          categoryMap.set(category.name, category._id);
        });

        const hospitalMap = new Map();
        const hospitalDocs = await Hospital.find();
        hospitalDocs.forEach((hospital) => {
          hospitalMap.set(hospital.name, hospital._id);
        });

        // Replace category and hospital names with IDs in treatments array
        treatments.forEach((treatment) => {
          treatment.category = categoryMap.get(treatment.category);
          treatment.hospital = hospitalMap.get(treatment.hospital);
        });

        // Seed treatments
        await Treatment.insertMany(treatments);

        console.log('Data seeded successfully.');
        process.exit(0);
      });
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
