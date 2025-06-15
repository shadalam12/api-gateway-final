import mongoose from 'mongoose';

// Define the RequestLog model
const RequestLogSchema = new mongoose.Schema(
  {
    path: { type: String, required: true },
    ip_address: { type: String, required: true },
    status_code: { type: Number, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'request_log',
  }
);

const RequestLog = mongoose.model('RequestLog', RequestLogSchema);
export default RequestLog;
