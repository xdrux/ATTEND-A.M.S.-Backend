import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import UserSchema from './models/userSchema.js';


// get user model registered in Mongoose
const User = mongoose.model("UserSchema", UserSchema);


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


const checkIfLoggedIn = (req, res) => {

    if (!req.cookies || !req.cookies.authToken) {
        // Scenario 1: FAIL - No cookies / no authToken cookie sent
        return res.send({ isLoggedIn: false });
    }

    // Token is present. Validate it
    return jwt.verify(
        req.cookies.authToken,
        "THIS_IS_A_SECRET_STRING",
        (err, tokenPayload) => {
            if (err) {
                // Scenario 2: FAIL - Error validating token
                return res.send({ isLoggedIn: false });
            }

            const userId = tokenPayload._id;

            // check if user exists
            return User.findById(userId, (userErr, user) => {
                if (userErr || !user) {
                    // Scenario 3: FAIL - Failed to find user based on id inside token payload
                    return res.send({ isLoggedIn: false });
                }

                // Scenario 4: SUCCESS - token and user id are valid
                console.log("user is currently logged in");
                return res.send({ isLoggedIn: true });
            });
        });
}

export { signUp, login, checkIfLoggedIn }