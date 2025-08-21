import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export async function seedAdminIfNeeded() {
	const admin = await User.findOne({ role: 'ADMIN' });
	if (admin) return;
	const name = 'System Admin';
	const email = process.env.ADMIN_EMAIL || 'admin@airport.local';
	const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
	const passwordHash = await bcrypt.hash(password, 10);
	await User.create({ name, email, passwordHash, role: 'ADMIN' });
	console.log('Seeded ADMIN user:', email);
}

