const router = require('express').Router();
const {register, login, userFromToken,} = require('../controllers/authController');
const {body, param} = require('express-validator');
const validationResultMiddleware = require('../middlewares/validationResultMiddleware');  

router.post('/register',
body('name').notEmpty().withMessage("Name is required"),
body('email').notEmpty().withMessage("Email is required"),
body('password').notEmpty().withMessage("Password is required"),
validationResultMiddleware,
register);

router.post('/login', 
body('email').notEmpty().withMessage("Email is required"),
body('password').notEmpty().withMessage("Password is required"),
validationResultMiddleware,
login);

router.get('/user', userFromToken);





module.exports = router;
