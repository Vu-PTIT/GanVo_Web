import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];

        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.userId).select("-hashedPassword");

        if (!user) {
            return next(new Error("Authentication error: User not found"));
        }

        socket.user = user;
        next();
    } catch (error) {
        console.error("Socket authentication error:", error.message);
        next(new Error("Authentication error"));
    }
};
