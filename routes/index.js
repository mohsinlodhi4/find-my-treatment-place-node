const router = require('express').Router();

const authMiddleware = require('../middlewares/auth');
const authRoutes = require('./authRoutes');
const treatmentRoutes = require('./treatmentRoutes');

router.use('/auth',authRoutes);
router.use('/treatment',treatmentRoutes);
// router.use('/orders', authMiddleware, orderRouter);

module.exports = router;