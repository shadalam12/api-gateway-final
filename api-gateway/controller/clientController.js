import { Client } from "../model/client.js";
import { generateToken } from "../lib/util.js";
import bcrypt from "bcrypt";

// Register a new client
export const registerClient = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).send("Please fill all the fields");
        }

        if (password.length < 6) {
            return res.status(400).send("Password must be at least 6 characters long");
        }

        const client = await Client.findOne({email});

        if (client) {
            return res.status(400).send("Client already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);   

        const newClient = await Client.create({
            name,
            email,
            password: hashedPassword,
        });

        if (newClient) {
            generateToken(newClient, res);
            await newClient.save();

            res.status(201).json({
                _id: newClient._id,
                name: newClient.name,
                email: newClient.email,
            });
        } else {
            return res.status(400).send("Invalid client data");
        }
    } catch (error) {
        console.log("Error in registerClient:", error.message);
        return res.status(500).send(error);

    }
}

// Login a client
export const loginClient = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).send("Please fill all the fields");
        }

        const client = await Client.findOne({email});

        if (!client) {
            return res.status(400).send("Invalid email or password");
        }

        const isPasswordCorrect = await bcrypt.compare(password, client.password);
        if (!isPasswordCorrect) {
            return res.status(400).send("Invalid email or password");
        }

        generateToken(client, res);

        res.status(200).json({
            _id: client._id,
            name: client.name,
            email: client.email,
        });
    } catch (error) {
        console.log("Error in loginClient:", error.message);
        return res.status(500).send(error);
    }
}

// Logout a client
export const logoutClient = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).send("Logged out successfully");
    } catch (error) {
        console.log("Error in logoutClient:", error.message);
        return res.status(500).send(error);
    }
}