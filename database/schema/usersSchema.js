const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

// Define User Schema
const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "UserId is required"],
        // trim: true,
        // minlength: 3,
        // maxlength: 50
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        // trim: true,
        // minlength: 3,
        // maxlength: 50
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        // trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        // minlength: 6
    },
    mobile: {
        type: Number,
        minlength: 10
    },
    gender: {
        type: String
    },
    dateOfBirth: {
        type: Date
    },
    bio: {
        type: String
    },
    homeAddress: {
        type: String
    },
    workAddress: {
        type: String
    },
    dp: {
        type: [String]
    },
    // age: {
    //     type: Number,
    //     min: 18,
    //     max: 100
    // },
    // role: {
    //     type: String,
    //     enum: ["user", "admin"],
    //     default: "user"
    // }
}, { timestamps: true });  // Automatically adds createdAt & updatedAt

// // Hash password before saving
// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next();
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

// // Compare password for login
// userSchema.methods.comparePassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

// Create User Model
const User = mongoose.model("User", userSchema);

module.exports = User;
