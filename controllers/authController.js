const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Role = require('../models/role');
const crypto = require("crypto");
const sendEmail = require("../utils/emails/sendEmail.js");
const clientURL = process.env.CLIENT_URL;
const {successResponse, errorResponse} = require('../utils/functions');
const { default: mongoose } = require('mongoose');


const register = async (req, res)=>{
    try{
        const {name, email, password} = req.body;

        const role = await Role.findOne({name: 'user'}).select('_id name');
        
        const oldUser = await User.findOne({ email: email});
        if(oldUser) return res.status(400).json(errorResponse('Email is already taken'));


        let hashPassword = await bcrypt.hash(password, 10);

        let user = await User.create({name, email, password: hashPassword, role: role._id,});
        let token = jwt.sign({id: user._id}, process.env.JWT_ENCRYPTION_KEY);
        user.role = role;
        user = user.toObject();
        user.token = token;

        return res.status(200).json(successResponse('Registration successfull.',{user}));

    }catch(e){
        return res.status(400).json(errorResponse( e.message ) );
    }
}

const login = async (req, res)=>{
    try{
            const {email, password} = req.body;

            let user = await User.findOne({email: email});
            if( !user || !(await bcrypt.compare(password, user.password)) ){
                return res.status(400).json(errorResponse('Invalid Email or Password')); 
            }

            let role = await Role.findOne({_id: mongoose.Types.ObjectId(user.role)}).select('_id name');

            user.role = role;

            if(user.status == 'in-active'){
                return res.status(401).json( errorResponse('Your account is locked', {}) );
            }

            let token = jwt.sign({id: user._id}, process.env.JWT_ENCRYPTION_KEY);
            user = user.toObject();
            user.token = token;

            return res.status(200).json(successResponse('Login successfull.',{ user }));
    
        }catch(e){
            console.log(e);
            return res.status(400).json(errorResponse('something went wrong.') );
        }
}

const userFromToken = async (req, res)=>{
    let token = req.query.token;
    if(!token) return res.status(401).json(errorResponse('Token Not found'));

    try{

        let {id}  = jwt.verify(token, process.env.JWT_ENCRYPTION_KEY);
        let user = await User.findById(id);
        if(!user) return res.status(400).json(errorResponse('User not found'));

        user = user.toObject();
        user.token = token;

        return res.json(successResponse('User fetched', {user}))

    }catch(e){
        return res.status(401).json(errorResponse('Invalid Token'));
    }
}

module.exports = {
    register,
    login,
    userFromToken,
}