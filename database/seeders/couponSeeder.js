const Coupon = require('../../models/coupon');
const bcrypt = require('bcrypt');

require('dotenv').config();
const connect = require('../connection');

connect().then( async ()=>{
    
    try {
        let coupon = await Coupon.create({user: '6416167a1ed99feb7b8a8249', secret: 'HQ12AB', amount: 200})
        console.log('yay!!', coupon);
      } catch (err) {
        console.log(err);
      }
      process.exit();
});


