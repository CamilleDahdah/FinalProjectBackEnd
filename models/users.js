const mongoose = require('mongoose');
const crypto = require('crypto');
const path = require('path');

const TripInfoSchema = require(path.resolve('models/trip_info_schema'))

const UserSchema = new mongoose.Schema({

    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    phoneNumber: {
        type: String,
    },
    city: {
        type: String,
    },
    country: {
        type: String,
    },
    salt: {
        type: String
    },
    trips: [TripInfoSchema]

});

UserSchema.pre('save', function (next) {
    if (this.password && this.isModified('password')) {
        this.salt = crypto.randomBytes(16).toString('base64');
        this.password = this.hashPassword(this.password)
    }
    next();
});

UserSchema.methods.hashPassword = function (password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha1').toString('base64');
    } else {
        return password;
    }
};

module.exports = mongoose.model('User', UserSchema);