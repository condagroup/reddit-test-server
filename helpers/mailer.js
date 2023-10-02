const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "mazeem8856.payoneer@gmail.com",
		pass: "fedhhwczeilwtacx"
	}
});

module.exports = transporter;
