import mongoose from 'mongoose';

const FlightSchema = new mongoose.Schema(
{
	flightNumber: { type: String, required: true, index: true },
	airline: { type: String, required: true },
	gate: { type: String },
	status: { type: String, enum: ['SCHEDULED', 'BOARDING', 'DELAYED', 'DEPARTED', 'CANCELLED'], default: 'SCHEDULED' },
	scheduledTime: { type: Date, required: true },
},
{ timestamps: true }
);

export default mongoose.model('Flight', FlightSchema);

