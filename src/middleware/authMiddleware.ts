import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserRole, IUser } from '../models/User';
import { JWT_SECRET } from '../config/config';
import mongoose from 'mongoose';

export interface JwtRequest extends Request {
    user?: {
        email: string;
        role: UserRole;
    };
}

export const authentication = async (req: JwtRequest, res: Response, next: NextFunction): Promise<any> => {
    const authHeader = req.headers.authorization;
    console.log(authHeader)

    if (!authHeader) {
        res.status(401).json('No authorization header found');
        return;
    }

    const token = authHeader.split(' ')[1]; 
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Decoded is: ", decoded)

        // req.user = await User.findById(decoded._id);


        req.user = decoded as IUser;
        console.log(req.user, decoded, " Added user")
        next();
    } catch (error) {
        res.status(401).json('Invalid token');
        return;
    }
};

export function authorizeRoles(allowedRoles: UserRole[] = [UserRole.ADMIN]) {
  return (req: JwtRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role)) {
      res.status(403).json({ 
        message: `Forbidden, you are a ${user?.role || "guest"} and this service is only available for ${allowedRoles.join(", ")}`
      });
      return; 
    }
    next(); 
  };
}


export const generateToken = (_id: mongoose.Types.ObjectId, role: string) => {
    return jwt.sign({ _id, role }, JWT_SECRET, { expiresIn: '1h' });
};