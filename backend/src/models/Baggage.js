import mongoose from 'mongoose';

const BaggageSchema = new mongoose.Schema(
{
	tagNumber: { type: String, required: true, unique: true },
	flightId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', index: true },
	status: { type: String, enum: ['AT_CHECKIN', 'LOADED', 'IN_TRANSIT', 'UNLOADED', 'AT_BELT'], default: 'AT_CHECKIN' }
},
{ timestamps: true }
);

export default mongoose.model('Baggage', BaggageSchema);

