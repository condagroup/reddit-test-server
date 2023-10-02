const jwt = require("express-jwt");
const secret = process.env.JWT_SECRET;

const authenticate = jwt(
	{
		secret: secret,
		algorithms: ["HS256"]
	},
	(req, res) => {
		res.status(401).json({
			success: 0,
			message: "Unauthorized"
		});
	}
);

module.exports = authenticate;