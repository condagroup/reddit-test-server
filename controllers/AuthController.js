const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const apiResponse = require("../helpers/apiResponse");

exports.login = (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
		} else {
			User.findOne({ username: req.body.username }).then(user => {
				if (user) {
					bcrypt.compare(req.body.password, user.password, function (err, same) {
						if (same) {
							let userData = {
								_id: user._id,
								username: user.username,
								email: user.email,
							};
							const jwtPayload = userData;
							const jwtData = { expiresIn: 3600000000 };
							const secret = process.env.JWT_SECRET;
							userData.token = jwt.sign(jwtPayload, secret, jwtData);
							return apiResponse.successResponseWithData(res, "Login Success.", userData);
						} else {
							return apiResponse.unauthorizedResponse(res, "Email or Password wrong.");
						}
					});
				} else {
					return apiResponse.unauthorizedResponse(res, "Email or Password wrong.");
				}
			});
		}
	} catch (err) {
		return apiResponse.ErrorResponse(res, err);
	}
};

exports.register = async (req, res) => {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		const errors = result.array({ onlyFirstError: true });
		return res.status(422).json({ errors });
	}

	try {
		const { username, password } = req.body;
		const user = await User.create({ username, password });
		const jwtPayload = user.toJSON();
		const jwtData = { expiresIn: 3600000000 };
		const secret = process.env.JWT_SECRET;
		const token = jwt.sign(jwtPayload, secret, jwtData);
		res.status(201).json({ success: 1, token });
	} catch (err) {
		res.status(201).json({ success: 0, err });
	}
};

exports.validate = method => {
	const errors = [
		body("username")
			.exists()
			.withMessage("is required")

			.isLength({ min: 1 })
			.withMessage("cannot be blank")

			.isLength({ max: 32 })
			.withMessage("must be at most 32 characters long")

			.custom(value => value.trim() === value)
			.withMessage("cannot start or end with whitespace")

			.matches(/^[a-zA-Z0-9_-]+$/)
			.withMessage("contains invalid characters"),

		body("password")
			.exists()
			.withMessage("is required")

			.isLength({ min: 1 })
			.withMessage("cannot be blank")

			.isLength({ min: 8 })
			.withMessage("must be at least 8 characters long")

			.isLength({ max: 72 })
			.withMessage("must be at most 72 characters long")
	];

	if (method === "register") {
		errors.push(
			body("username").custom(async username => {
				const exists = await User.countDocuments({ username });
				if (exists) throw new Error("already exists");
			})
		);
	}

	return errors;
};
