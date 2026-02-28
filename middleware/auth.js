import jwt from 'jsonwebtoken';
import User from '../Models/User.js';
import "dotenv/config";

const authenticateUser = async (req, res, next) => {
    try {
        let token = req?.headers?.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).send({
            message: "Access denied. No token provided."
        });
    }
    const decoded  =jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded){
        return res.status(401).send({
            message: "Invalid token"
        });
    }
    let getUser = await User.findById(decoded.id).select("-password");
    req.user = getUser;
    next();
    
    } catch (error) {
        return res.status(401).send({
            message: error.message || "Invalid token call"
        });  
    }
    
}
export default authenticateUser;