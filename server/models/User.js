const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true
    },
    stripeCustomerId: {
        type: String
    },
    isSubscribed: { 
        type: Boolean,
        default: false
    },
    userType: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User =  mongoose.model('User', userSchema);
module.exports = User;