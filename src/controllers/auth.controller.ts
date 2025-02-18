import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User, { UserRole } from '../models/User';
import { generateToken } from '../middleware/authMiddleware';

const registerUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error:"Invalid role"});
        }

        const validRoles = Object.values(UserRole);
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error:"Invalid role"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();
        return res.status(201).json({ message: 'User created' });

    } catch (e: any) {
        console.log(e)
        return res.status(400).json({ error: e.message });
    }
}

export const loginUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;
        const user : any = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User does not exist' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = generateToken(user._id, user.role);
        return res.status(200).json({ token });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export {registerUser};