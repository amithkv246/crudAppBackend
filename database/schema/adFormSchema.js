const mongoose = require("mongoose");

const adFormSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "UserId is required"]
    },
    brand: {
        type: String,
        required: [true, "Brand is required"]
    },
    year: {
        type: String,
        required: [true, "Year is required"]
    },
    fuel: {
        type: String,
        required: [true, "Fuel is required"]
    },
    transmission: {
        type: String,
        required: [true, "Transmission is required"]
    },
    kmDriven: {
        type: String,
        required: [true, "KM Driven is required"]
    },
    noOfOwners: {
        type: String,
        required: [true, "No of owners is required"]
    },
    adTitle: {
        type: String,
        required: [true, "Ad title is required"]
    },
    description: {
        type: String,
        required: [true, "Ad description is required"]
    },
    price: {
        type: String,
        required: [true, "Price is required"]
    },
    imagePath: {
        type: [String],
        required: [true, "Images are required"]
    },
    location: {
        type: String,
        required: [true, "Location is required"]
    }
}, { timestamps: true });

const AdForm = mongoose.model("AdForm", adFormSchema);

module.exports = AdForm;
