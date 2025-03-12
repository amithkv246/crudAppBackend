require("dotenv").config()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../database/schema/usersSchema")
const AdForm = require("../database/schema/adFormSchema")
const { v4: uuidv4 } = require('uuid');

exports.firstGet = async (req, res) => {
    // console.log(req)
    res.send("First Get");
}

exports.firstPost = async (req, res) => {
    const { name, age } = req.body
    res.send("My name is " + name + " and my age is " + age);
}

exports.register = async (req, res) => {
    const { name, email, password } = req.body
    const generateUserId = () => {
        const uuid = uuidv4(); // Generate a UUID
        return `100-${uuid}`;   // Combine the prefix '100-' with the UUID
    };
    try {
        const existingUser = await User.findOne({ email })
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        if (!name || !email || !password) {
            return res.status(406).json("Provide all credentials")
        } else if (existingUser) {
            return res.status(406).json("Account already exist. Please login")
        }
        else {
            const newUserId = generateUserId();
            const newUser = new User({ userId: newUserId, name, email, password: hashedPassword })
            await newUser.save()
            return res.status(200).json("Registered successfully")
        }
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body
    try {
        const existingUser = await User.findOne({ email: email })
        if (!existingUser) {
            return res.status(406).json("user not found")
        }
        const passwordMatch = await bcrypt.compare(password, existingUser.password)
        if (!passwordMatch) {
            return res.status(406).json("invalid credentials")
        } else {
            const token = jwt.sign({ emailId: existingUser.email }, process.env.JWT_SECRET, { expiresIn: "5h" })
            return res.status(200).json({ userDetails: existingUser, token })
        }
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

exports.updateUser = async (req, res) => {
    const formData = req.body
    const formFiles = req.files
    if (formData && formFiles) {
        try {
            const existingUser = await User.findOne({ email: formData.email })
            if (existingUser) {
                try {
                    if (formData.password) {
                        const saltRounds = 10
                        const hashedPassword = await bcrypt.hash(formData.password, saltRounds)
                        existingUser.password = hashedPassword;
                    }
                    if (formData.name) existingUser.name = formData.name;
                    if (formData.mobile) existingUser.mobile = formData.mobile;
                    if (formData.gender) existingUser.gender = formData.gender;
                    if (formData.dateOfBirth) existingUser.dateOfBirth = formData.dateOfBirth;
                    if (formData.bio) existingUser.bio = formData.bio;
                    if (formData.homeAddress) existingUser.homeAddress = formData.homeAddress;
                    if (formData.workAddress) existingUser.workAddress = formData.workAddress;
                    if (formFiles.length > 0) {
                        const imagePath = formFiles.map(file => `/images/dp/${file.filename}`)
                        existingUser.dp = imagePath;
                    }
                    await existingUser.save();
                    return res.status(200).json("Updated Successfully");
                } catch (err) {
                    return res.status(500).json({ error: err.message })
                }
            }
            else {
                return res.status(406).json({ msg: "user not found" })
            }
        } catch (err) {
            return res.status(500).json({ error: err.message })
        }
    }
}


exports.adPost = async (req, res) => {
    const formData = req.body
    const formFiles = req.files
    try {
        if (formFiles && formData) {
            const imagePaths = formFiles.map(file => `/images/car/${file.filename}`);
            const newAd = new AdForm({
                userId: formData.userId,
                brand: formData.brand,
                year: formData.year,
                fuel: formData.fuel,
                transmission: formData.transmission,
                kmDriven: formData.kmDriven,
                noOfOwners: formData.noOfOwners,
                adTitle: formData.adTitle,
                description: formData.description,
                price: formData.price,
                imagePath: imagePaths,
                location: formData.location
            });
            await newAd.save();
            return res.status(200).json({
                msg: "Images uploaded and data saved successfully.",
                ad: newAd // Send the saved ad document in the response
            })
        } else {
            return res.status(400).json({ msg: "No files found in the request." })
        }
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

exports.getUserAds = async (req, res) => {
    const { userId } = req.params;
    try {
        const ads = await AdForm.find({ userId });
        if (ads.length === 0) {
            return res.status(404).json({ message: "No ads found for this user" });
        }
        return res.status(200).json(ads);
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
};

exports.getUserDetails = async (req, res) => {
    const { userId } = req.params;
    try {
        const userDetails = await User.findOne({ userId });
        if (!userDetails) {
            return res.status(404).json({ message: "No userDetails found for this userId" });
        }
        return res.status(200).json(userDetails);
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
};
