import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

//the user schema
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
});

UserSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) return next();

    return bcrypt.genSalt((saltError, salt) => {
        if (saltError) { return next(saltError); }

        return bcrypt.hash(user.password, salt, (hashError, hash) => {
            if (hashError) { return next(hashError); }

            user.password = hash;
            return next();
        });
    });
});

UserSchema.methods.comparePassword = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, this.password, (err, isMatch) => {
            if (err) return reject(err);
            return resolve(isMatch);
        });
    });
}


mongoose.model("UserSchema", UserSchema);
export default UserSchema