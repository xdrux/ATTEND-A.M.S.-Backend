import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import UserSchema from './models/userSchema.js';


// get user model registered in Mongoose
const User = mongoose.model("UserSchema", UserSchema);

// saving the new user
const signUp = (req, res) => {
    const newuser = new User({
        email: req.body.email,
        password: req.body.password
    });

    console.log("New user: ");
    console.log(newuser);


    newuser.save();
    res.send({ status: "OK" })


}

// for logging in
const login = async (req, res) => {
    try {
        const email = req.body.email.trim();
        const password = req.body.password;

        const user = await User.findOne({ email });

        if (!user) {
            console.log("user doesn't exist");
            return res.send({ success: false });
        }

        const isMatch = await user.comparePassword(password);


        if (!isMatch) {
            console.log("wrong password");
            return res.send({ success: false });
        }

        console.log("Successfully logged in");

        const tokenPayload = {
            _id: user._id
        };

        const token = jwt.sign(tokenPayload, "THIS_IS_A_SECRET_STRING");

        return res.send({ success: true, token, useremail: user.email });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error" });
    }
};

// checking if the user is logged in
const checkIfLoggedIn = async (req, res) => {
    try {
        console.log(req.cookies);

        if (!req.cookies || !req.cookies.authToken) {
            return res.send({ isLoggedIn: false });
        }

        // Validate token
        const tokenPayload = await jwt.verify(
            req.cookies.authToken,
            "THIS_IS_A_SECRET_STRING"
        );

        const userId = tokenPayload._id;

        // Check if user exists
        const user = await User.findById(userId);

        if (!user) {
            return res.send({ isLoggedIn: false });
        }

        // Token and user ID are valid
        console.log("User is currently logged in");
        return res.send({ isLoggedIn: true });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Internal server error" });
    }
};


export { signUp, login, checkIfLoggedIn }