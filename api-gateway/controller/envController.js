import Environment from "../model/environment.js";

// Get all the environments
export const getAllEnvironments = async (req, res) => { 
    try {
        const environments = await Environment.findAll();
        res.status(200).json(environments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new environment
export const createEnvironment = async (req, res) => { 
    try {
        const client_id = req.client.client_id;
        console.log(client_id);
        const environment = await Environment.create({ ...req.body, client_id });
        res.status(201).json(environment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};