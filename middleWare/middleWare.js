const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {

    try {
        const token = req.header("Authorization"); // Get token from headers

        if (!token) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        // Verify token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Add user data to request

        next();
    } catch (err) {
        return res.status(403).json({ error: err.message });
    }
};
