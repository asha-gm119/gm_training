import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
{
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true, index: true },
	passwordHash: { type: String, required: true },
	role: { type: String, enum: ['ADMIN', 'AIRLINE', 'BAGGAGE'], required: true },
},
{ timestamps: true }
);

export default mongoose.model('User', UserSchema);

