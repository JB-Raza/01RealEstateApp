import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyUser = async (req, res, next) => {

    const token = req.cookies.access_token;
    if(!token) return next(errorHandler(401, "no token found! You are not authorized to access this route sire"));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return next(errorHandler(403, "Token is not valid sire"));
        req.user = user;
        next();
    })
}