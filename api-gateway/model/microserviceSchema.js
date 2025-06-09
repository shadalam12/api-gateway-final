import mongoose from 'mongoose';

// Schema for storing microservice details
const microserviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  url: {
    type: String,
    required: true,
    unique: true,
  },
  maxTime : {
    type: Number,
  },
  maxLimit: {
    type: Number,
    default: 1000
  },
})

export default mongoose.model('Microservice', microserviceSchema);