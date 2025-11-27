import jwt from "jsonwebtoken";

// Verify JWT Token
export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Token should come as: "Bearer <token>"
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "No token provided, authorization denied" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // attach user info (id) to request
        next(); // move to next middleware/route
    } catch (err) {
        return res.status(401).json({ msg: "Invalid or expired token" });
    }
};
