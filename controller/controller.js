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

exports.updateUser = async (request, response) => {
    const { nameToUpdate, currentEmail, emailIdToUpdate, passwordToUpdate } = request.body
    console.log(nameToUpdate, currentEmail, emailIdToUpdate, passwordToUpdate);

    try {

        const existingUser = await User.findOne({ email: currentEmail })
        if (existingUser) {

            try {
                if (nameToUpdate) existingUser.name = nameToUpdate;
                if (emailIdToUpdate) existingUser.email = emailIdToUpdate;
                if (passwordToUpdate) existingUser.password = passwordToUpdate;
                await existingUser.save();


                return response.status(200).json({
                    msg: `${nameToUpdate ? "name, " : ""}${emailIdToUpdate ? "email, " : ""}${passwordToUpdate ? "password " : ""}updated successfully`.trim().replace(/,\s*$/, "")
                });

            } catch (error) {
                return response.status(500).json({ error: error.message });
            }

        }

        else {
            console.log(existingUser);

            return response.status(406).json({ msg: "user not found" })
        }
    } catch (error) {
        return response.status(400).json("error:", error)
    }
}


exports.adPost = async (req, res) => {
    console.log("\n Entered function body of adPost.")
    console.log("BODY: \n", req.body)
    console.log("IMAGES: \n", req.files)
    const formData = req.body
    const formFiles = req.files
    try {
        if (formFiles) {
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
