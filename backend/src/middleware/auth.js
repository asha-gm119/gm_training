import jwt from 'jsonwebtoken';

export function authMiddleware(allowedRoles = []) {
	return (req, res, next) => {
		const header = req.headers.authorization || '';
		const token = header.startsWith('Bearer ') ? header.slice(7) : null;
		if (!token) return res.status(401).json({ error: 'Unauthorized' });
		try {
			const payload = jwt.verify(token, process.env.JWT_SECRET);
			req.user = payload;
			if (allowedRoles.length && !allowedRoles.includes(payload.role)) {
				return res.status(403).json({ error: 'Forbidden' });
			}
			next();
		} catch (e) {
			return res.status(401).json({ error: 'Invalid token' });
		}
	};
}

export function signJwt(user) {
	return jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '12h' });
}

