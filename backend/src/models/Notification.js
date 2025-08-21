import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
{
	type: { type: String, enum: ['FLIGHT_DELAY', 'BAGGAGE_BELT', 'INFO'], required: true },
	message: { type: String, required: true },
	audience: { type: String, enum: ['STAFF', 'PASSENGERS', 'ALL'], default: 'ALL' },
	flightId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' }
},
{ timestamps: true }
);

export default mongoose.model('Notification', NotificationSchema);

