const router = require('express').Router();
const {searchTreatments, treatmentsByCategory, getSingleTreatment, getCategories, getSuggestions} = require('../controllers/treatmentController');
const {body, param} = require('express-validator');
const validationResultMiddleware = require('../middlewares/validationResultMiddleware');  

router.get('/search', searchTreatments);

router.get('/search-suggestions', getSuggestions);

router.get('/category/list', getCategories);

router.get('/category/:id', 
param('id').isMongoId().withMessage("Invalid Category id"),
validationResultMiddleware,
treatmentsByCategory);

router.get('/:id', 
param('id').isMongoId().withMessage("Invalid Treatment id"),
validationResultMiddleware,
getSingleTreatment);


module.exports = router;
