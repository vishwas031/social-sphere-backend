// this file takes cares of the register/login function

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// REGISTER USER
export const register = async(req, res) => {
    try {
        // we fetched all the details from the frontend(request sent by from the frontend)
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        // this will generate a random salt which will be used to encrypt our password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random()*10000),
            impression: Math.floor(Math.random()*10000),
        });
        // we saved this user to savedUser and return it as response
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error : err.message });
    }
}

// LOGIN USER
export const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        // check if the user exists in the DB
        const user = await User.findOne({email: email});
        if(!user) return res.status(400).json({msg: "First register yourself"});

        // now check if the password entered is correct or not
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({msg: "Invalid Credentials"});

        // now generate a token with his/her userID and a secret_key, which would be used by other routes to check if the user is valid or not to access that route
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        // delete the password(un-hashed) after checking, so that it wont be sent back to the frontend
        delete user.password;
        res.status(200).json({token, user});
     } catch (err) {
        res.status(400).json({error : err.message});
    }
}