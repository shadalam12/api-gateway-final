import User from "../model/user.js";
import { generateToken } from "../lib/util.js";
import bcrypt from "bcrypt";

// Signup a new user
export const signup = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).send("Please fill all the fields");
        }

        if (password.length < 6) {
            return res.status(400).send("Password must be at least 6 characters long");
        }

        const user = await User.findOne({email});

        if (user) {
            return res.status(400).send("User already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);   

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role
        });

        if (newUser) {
            generateToken(newUser, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            });
        } else {
            return res.status(400).send("Invalid client data");
        }
    } catch (error) {
        console.log("Error in signup:", error.message);
        return res.status(500).send(error);

    }
}

// Login a user
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).send("Please fill all the fields");
        }

        const user = await User.findOne({where : {email}});

        if (!user) {
            return res.status(400).send("Invalid email or password");
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).send("Invalid email or password");
        }

        generateToken(user, res);

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
        });
    } catch (error) {
        console.log("Error in loginClient:", error.message);
        return res.status(500).send(error);
    }
}

// Logout a user
export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).send("Logged out successfully");
    } catch (error) {
        console.log("Error in logoutClient:", error.message);
        return res.status(500).send(error);
    }
}