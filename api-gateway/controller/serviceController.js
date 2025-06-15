import Service from "../model/service.js";

// Get all the services
export const getAllServices = async (req, res) => { 
    try {
        const services = await Service.findAll();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new service
export const createService = async (req, res) => { 
    try {
        const client_id = req.client.client_id;
        console.log(client_id);
        const service = await Service.create({ ...req.body, client_id });
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};